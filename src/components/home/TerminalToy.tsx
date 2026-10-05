import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { links } from "../../lib/links.ts";

/**
 * The installer scene's terminal. It plays its little install on its own;
 * click it and it takes commands ("help" lists them). A few of them open
 * real places on the forum.
 */

const PLACES: Record<string, string> = {
  forum: links.forum,
  latest: links.latest,
  guides: links.guides,
  apps: links.androidApps,
  egate: "/home/egate",
  installer: links.installer,
  dumb: links.dumbcourse,
  leaderboard: links.leaderboard,
};

const SINCE = new Date("2023-07-28T22:09:29Z");

function uptime(): string {
  const days = Math.floor((Date.now() - SINCE.getTime()) / 86400000);
  return `up ${days} days, since July 2023`;
}

function run(input: string): { lines: string[]; open?: string; clear?: boolean; exit?: boolean } {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ");
  switch (command.toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
      return {
        lines: [
          "adb devices     list connected phones",
          "ls              what's here",
          "open <place>    open a place (ls lists them)",
          "whoami          who's typing",
          "uptime          how long JTech has been up",
          "egate           about eGate",
          "echo <text>     say something",
          "clear · exit",
        ],
      };
    case "adb":
      if (args[0] === "devices") return { lines: ["List of devices attached", "JT3CH0001      device"] };
      if (args[0] === "shell") return { lines: ["shell@flip:/ $ exit", "(that one's for real phones)"] };
      return { lines: ["usage: adb devices"] };
    case "fastboot":
      return { lines: ["< waiting for any device >"] };
    case "ls":
      return { lines: [Object.keys(PLACES).map((p) => `${p}/`).join("  ")] };
    case "cd":
    case "open":
    case "start": {
      const place = arg.replace(/\/$/, "").toLowerCase();
      const href = PLACES[place];
      if (!href) return { lines: [`no such place: ${arg || "(nothing)"}. Try ls.`] };
      return { lines: [`opening ${place}…`], open: href };
    }
    case "whoami":
      return { lines: ["a curious visitor (sign up to be someone)"] };
    case "uptime":
      return { lines: [uptime()] };
    case "egate":
      return { lines: ["eGate · offline Android device manager", "one license, no subscription → open egate"] };
    case "echo":
      return { lines: [arg] };
    case "date":
      return { lines: [new Date().toString().replace(/ \(.*\)$/, "")] };
    case "sudo":
      return { lines: [arg.includes("rm") ? "Not on my watch." : "Nice try. This incident will be reported to @TripleU."] };
    case "rm":
      return { lines: ["Permission denied. (Good.)"] };
    case "jtech":
      return { lines: ["╭─────────────╮", "│  J T E C H  │  forums", "╰─────────────╯  since 2023"] };
    case "reboot":
      return { lines: ["rebooting…"], clear: true };
    case "clear":
      return { lines: [], clear: true };
    case "exit":
    case "logout":
      return { lines: [], exit: true };
    default:
      return { lines: [`${command}: command not found. Try help.`] };
  }
}

export default function TerminalToy() {
  const [live, setLive] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [recall, setRecall] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [history]);

  const start = () => {
    if (!live) {
      setLive(true);
      setHistory(["JTech installer shell. Type help."]);
    }
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = run(value);
    if (value.trim()) setPast((p) => [value, ...p].slice(0, 20));
    setRecall(-1);
    setValue("");
    if (result.exit) {
      setLive(false);
      setHistory([]);
      return;
    }
    setHistory((h) => (result.clear ? result.lines : [...h, `$ ${value}`, ...result.lines]).slice(-40));
    if (result.open) {
      const href = result.open;
      setTimeout(() => window.location.assign(href), 450);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && past.length) {
      event.preventDefault();
      const next = Math.min(past.length - 1, recall + 1);
      setRecall(next);
      setValue(past[next] ?? "");
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = recall - 1;
      setRecall(next);
      setValue(next >= 0 ? (past[next] ?? "") : "");
    } else if (event.key === "Escape") {
      setLive(false);
      setHistory([]);
    }
  };

  return (
    <div
      className={`rail-terminal${live ? " is-live" : ""}`}
      onClick={start}
      onKeyDown={(event) => {
        if (!live && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          start();
        }
      }}
      role={live ? undefined : "button"}
      tabIndex={live ? -1 : 0}
      aria-label={live ? undefined : "A terminal. Press Enter to type commands."}
    >
      <div className="terminal-top">
        <span>● ● ●</span> JTECH / INSTALLER
      </div>
      {live ? (
        <div className="terminal-content terminal-live" ref={body}>
          {history.map((line, i) => (
            <p key={i} className={line.startsWith("$ ") ? "terminal-cmd" : ""}>
              {line}
            </p>
          ))}
          <form onSubmit={submit} className="terminal-prompt">
            <span>$</span>
            <input
              ref={input}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              aria-label="Terminal command"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="go"
            />
          </form>
        </div>
      ) : (
        <div className="terminal-content">
          <span className="terminal-muted">$ adb devices</span>
          <p>
            <span>✓</span> Phone connected
          </p>
          <p>
            <span>✓</span> USB debugging on
          </p>
          <p>
            <span>✓</span> Device manager installed
          </p>
          <div className="terminal-bar">
            <span />
          </div>
          <strong>
            READY WHEN YOU ARE<b>_</b>
          </strong>
        </div>
      )}
    </div>
  );
}

