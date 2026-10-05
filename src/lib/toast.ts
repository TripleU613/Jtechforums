/** Android-style toasts: a short line at the bottom of the screen (components/Toaster.tsx). */
export const TOAST_EVENT = "jt:toast";

export function toast(message: string, ms = 2400): void {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, ms } }));
}
