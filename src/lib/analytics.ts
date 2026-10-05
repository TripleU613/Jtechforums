/**
 * Google Analytics through Firebase, as before, configured by the
 * VITE_FIREBASE_* build variables. Loaded after the page is up so it never
 * delays the first paint; without the variables (local builds) it does
 * nothing.
 */
export function startAnalytics(): void {
  const env = import.meta.env;
  if (env.DEV || !env.VITE_FIREBASE_API_KEY || !env.VITE_FIREBASE_PROJECT_ID) return;
  const start = async () => {
    const [{ initializeApp }, { getAnalytics, isSupported }] = await Promise.all([
      import("firebase/app"),
      import("firebase/analytics"),
    ]);
    if (!(await isSupported())) return;
    getAnalytics(
      initializeApp({
        apiKey: env.VITE_FIREBASE_API_KEY,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.VITE_FIREBASE_APP_ID,
        measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
      }),
    );
  };
  const later = () => void start().catch(() => {});
  if (document.readyState === "complete") setTimeout(later, 1500);
  else window.addEventListener("load", () => setTimeout(later, 1500), { once: true });
}
