import { useEffect, useState } from "react";
import { forumJson } from "./forum.ts";

export type LoadState<T> =
  | { status: "loading"; data: null }
  | { status: "ready"; data: T }
  | { status: "error"; data: null };

/** Fetch one of the forum's public JSON documents for a component. */
export function useForum<T>(path: string): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ status: "loading", data: null });
  useEffect(() => {
    const controller = new AbortController();
    forumJson<T>(path, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error", data: null });
      });
    return () => controller.abort();
  }, [path]);
  return state;
}
