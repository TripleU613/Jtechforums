import { useEffect, useState } from "react";
import { forumJson } from "./forum.ts";

export type LoadState<T> =
  | { status: "loading"; data: null }
  | { status: "ready"; data: T }
  | { status: "error"; data: null };

/** One of the forum's public JSON documents, for a component. */
export function useForum<T>(path: string): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ status: "loading", data: null });
  useEffect(() => {
    let live = true;
    forumJson<T>(path).then(
      (data) => live && setState({ status: "ready", data }),
      () => live && setState({ status: "error", data: null }),
    );
    return () => {
      live = false;
    };
  }, [path]);
  return state;
}
