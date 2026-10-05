import { useMemo } from "react";
import { forumPaths, type CategoriesPayload } from "./forum.ts";
import { useForum } from "./useForum.ts";

export interface CategoryCounts {
  topics: number;
  week: number;
  subs: string[];
}

/** Topic totals per category, subcategories included, and their names, from /categories.json. */
export function useCategoryCounts(): Map<number, CategoryCounts> {
  const state = useForum<CategoriesPayload>(forumPaths.categories);
  return useMemo(() => {
    const counts = new Map<number, CategoryCounts>();
    for (const category of state.data?.category_list?.categories ?? []) {
      const subs = category.subcategory_list ?? [];
      counts.set(category.id, {
        topics: subs.reduce((sum, sub) => sum + (sub.topic_count ?? 0), category.topic_count ?? 0),
        week: subs.reduce((sum, sub) => sum + (sub.topics_week ?? 0), category.topics_week ?? 0),
        subs: subs.map((sub) => sub.name),
      });
    }
    return counts;
  }, [state.data]);
}
