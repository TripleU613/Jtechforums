import path from "node:path";
import dotenv from "dotenv";
import express, { type Response } from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

dotenv.config({ path: path.join(__dirname, "..", ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const DISCOURSE_API_KEY = defineSecret("DISCOURSE_API_KEY");
const CONTACT_SMTP_PASS = defineSecret("CONTACT_SMTP_PASS");
const DEFAULT_DISCOURSE_API_BASE = "https://jtechforums.org";
const DEFAULT_DISCOURSE_API_USERNAME = "system";

const forumBase = (): string =>
  (process.env.DISCOURSE_API_BASE || DEFAULT_DISCOURSE_API_BASE).replace(/\/$/, "");
const forumUsername = (): string =>
  process.env.DISCOURSE_API_USERNAME || DEFAULT_DISCOURSE_API_USERNAME;
const sanitizeCategory = (value = ""): string =>
  value.replace(/[^a-z0-9/-]/gi, "").replace(/\.\./g, "");

function discourseApiKey(): string {
  if (process.env.DISCOURSE_API_KEY) return process.env.DISCOURSE_API_KEY;
  try {
    return DISCOURSE_API_KEY.value();
  } catch (error) {
    logger.warn("Discourse API secret unavailable via Secret Manager", error);
    return "";
  }
}

/**
 * Relay a Discourse JSON endpoint. The landing page now reads the forum's
 * public JSON itself (same origin), so these routes only serve older
 * builds and anything else that still calls them.
 */
async function proxyJson(res: Response, endpoint: string, cacheSeconds = 300): Promise<void> {
  const apiKey = discourseApiKey();
  if (!apiKey) {
    res.status(500).json({ error: "Forum API secret is not configured." });
    return;
  }
  try {
    const response = await fetch(`${forumBase()}${endpoint}`, {
      headers: { "Api-Key": apiKey, "Api-Username": forumUsername(), Accept: "application/json" },
    });
    if (!response.ok) {
      res.status(response.status).json({ error: "Discourse request failed", detail: await response.text() });
      return;
    }
    const payload: unknown = await response.json();
    res.set("Cache-Control", `public, max-age=${cacheSeconds}`);
    res.json(payload);
  } catch (error) {
    logger.error("Discourse proxy error", error);
    res.status(502).json({ error: "Unable to reach Discourse", detail: (error as Error).message });
  }
}

interface ContactConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  to: string;
  recaptchaSiteKey: string;
  recaptchaProjectId: string;
  recaptchaMinScore: number;
}

function contactConfig(): ContactConfig {
  const port = Number(process.env.CONTACT_SMTP_PORT || 465);
  return {
    host: process.env.CONTACT_SMTP_HOST || "smtp.gmail.com",
    port,
    secure: process.env.CONTACT_SMTP_SECURE ? process.env.CONTACT_SMTP_SECURE !== "false" : port === 465,
    user: process.env.CONTACT_SMTP_USER || "",
    to: process.env.CONTACT_TO_EMAIL || "",
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || "",
    recaptchaProjectId:
      process.env.RECAPTCHA_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "",
    recaptchaMinScore: Number(process.env.RECAPTCHA_MIN_SCORE || 0.5),
  };
}

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
}

async function sendContactEmail({ name, email, phone, message }: ContactMessage): Promise<void> {
  const config = contactConfig();
  const pass = CONTACT_SMTP_PASS.value() || "";
  if (!config.user || !config.to || !pass) {
    throw new Error("Contact email transport is not configured (CONTACT_SMTP_USER, CONTACT_TO_EMAIL, CONTACT_SMTP_PASS).");
  }
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass },
  });
  const lines = [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "(not given)"}`, "", message];
  await transporter.sendMail({
    from: `"JTech Website" <${config.user}>`,
    to: config.to,
    subject: `New JTech contact from ${name}`,
    text: lines.join("\n"),
    html: lines.map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "<br/>")).join(""),
    replyTo: email,
  });
}

let recaptchaClient: RecaptchaEnterpriseServiceClient | undefined;

/**
 * Check a reCAPTCHA Enterprise token. Skipped (true) when no site key or
 * project is configured. Every refusal is logged with its reason, so
 * `firebase functions:log` shows why a message was turned away.
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const { recaptchaSiteKey, recaptchaProjectId, recaptchaMinScore } = contactConfig();
  if (!recaptchaSiteKey || !recaptchaProjectId) return true;
  if (!token) {
    logger.warn("reCAPTCHA: no token sent");
    return false;
  }
  try {
    recaptchaClient ??= new RecaptchaEnterpriseServiceClient();
    const [assessment] = await recaptchaClient.createAssessment({
      parent: recaptchaClient.projectPath(recaptchaProjectId),
      assessment: { event: { token, siteKey: recaptchaSiteKey, expectedAction: "contact" } },
    });
    const { tokenProperties, riskAnalysis } = assessment;
    if (!tokenProperties?.valid) {
      logger.warn("reCAPTCHA: invalid token", {
        invalidReason: tokenProperties?.invalidReason,
        hostname: tokenProperties?.hostname,
      });
      return false;
    }
    if (tokenProperties.action && tokenProperties.action !== "contact") {
      logger.warn("reCAPTCHA: unexpected action", { action: tokenProperties.action });
      return false;
    }
    const score = typeof riskAnalysis?.score === "number" ? riskAnalysis.score : 1;
    if (score < recaptchaMinScore) {
      logger.warn("reCAPTCHA: score below threshold", {
        score,
        recaptchaMinScore,
        reasons: riskAnalysis?.reasons,
        hostname: tokenProperties.hostname,
      });
      return false;
    }
    return true;
  } catch (error) {
    logger.error("reCAPTCHA: assessment failed (API enabled? service account allowed to create assessments?)", error);
    return false;
  }
}

const app = express();
// Requests arrive through Cloudflare and Firebase Hosting; without this,
// every visitor shares one address and one rate limit.
app.set("trust proxy", true);
// The form posts from the homepage (jtechforums.org/home, through /api); a
// browser on any other site gets no CORS headers, so it can't send it.
// Requests without an Origin (curl, server-side) still meet the captcha and
// the rate limit below.
const ALLOWED_ORIGINS = new Set([
  "https://jtechforums.org",
  "https://www.jtechforums.org",
  "https://jtechsite-2ebc8.web.app",
  "https://jtechsite-2ebc8.firebaseapp.com",
]);
const LOCAL_DEV = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(
  cors({
    origin: (origin, done) => done(null, !origin || ALLOWED_ORIGINS.has(origin) || LOCAL_DEV.test(origin)),
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use((req, _res, next) => {
  logger.info("Incoming request", { path: req.path });
  next();
});

const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const visitor = req.get("cf-connecting-ip") || req.ip || "unknown";
    return ipKeyGenerator(visitor);
  },
  message: { error: "Too many messages from this address. Please try again later." },
});

const field = (body: Record<string, unknown>, key: string): string =>
  typeof body[key] === "string" ? (body[key] as string).trim() : "";

app.post(["/contact", "/api/contact"], contactRateLimiter, async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (field(body, "_honey")) {
    res.status(200).json({ ok: true, message: "Message received." });
    return;
  }
  const message: ContactMessage = {
    name: field(body, "name"),
    email: field(body, "email"),
    phone: field(body, "phone"),
    message: field(body, "message"),
  };
  if (!message.name || !message.email || !message.message) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }
  if (!(await verifyRecaptcha(field(body, "recaptchaToken")))) {
    res.status(400).json({ error: "Unable to verify you are human." });
    return;
  }
  try {
    await sendContactEmail(message);
    res.status(202).json({ ok: true, message: "Message sent. Thanks for reaching out!" });
  } catch (error) {
    logger.error("Failed to deliver contact email", error);
    res.status(502).json({ error: "Unable to send email right now. Please try again later." });
  }
});

const forumRouter = express.Router();

forumRouter.get("/forum/latest", async (req, res) => {
  const page = Number.isInteger(Number(req.query.page)) ? Number(req.query.page) : 0;
  const category = typeof req.query.category === "string" ? req.query.category : "";
  const segment = category ? `/c/${sanitizeCategory(category)}/l/latest.json` : "/latest.json";
  await proxyJson(res, `${segment}?page=${page}&include_excerpt=true`);
});

forumRouter.get("/forum/about", async (_req, res) => {
  await proxyJson(res, "/about.json", 600);
});

forumRouter.get("/forum/staff/weekly", async (_req, res) => {
  await proxyJson(res, "/directory_items.json?period=weekly&order=likes_received&role=staff", 600);
});

forumRouter.get("/forum/topic/:id", async (req, res) => {
  const topicId = Number(req.params.id);
  if (!topicId) {
    res.status(400).json({ error: "Invalid topic id" });
    return;
  }
  await proxyJson(res, `/t/${topicId}.json`, 120);
});

forumRouter.get("/forum/leaderboard/:id", async (req, res) => {
  const leaderboardId = Number(req.params.id);
  if (!leaderboardId) {
    res.status(400).json({ error: "Invalid leaderboard id" });
    return;
  }
  const period = typeof req.query.period === "string" ? `?period=${encodeURIComponent(req.query.period)}` : "";
  await proxyJson(res, `/leaderboard/${leaderboardId}.json${period}`, 600);
});

app.use("/", forumRouter);
app.use("/api", forumRouter);

export const forumApi = onRequest(
  { region: "us-central1", secrets: [DISCOURSE_API_KEY, CONTACT_SMTP_PASS], timeoutSeconds: 30 },
  app,
);
