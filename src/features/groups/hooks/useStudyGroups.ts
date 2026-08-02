"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { fetchGroups, GROUPS_CHANGED_EVENT } from "../services/groupApi";

export function useStudyGroups(enabled: boolean) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const loadGroups = () => {
      void fetchGroups()
        .then((nextGroups) => {
          if (!cancelled) setGroups(nextGroups);
        })
        .catch((error) => console.error("Error getting groups:", error));
    };

    loadGroups();
    window.addEventListener(GROUPS_CHANGED_EVENT, loadGroups);

    return () => {
      cancelled = true;
      window.removeEventListener(GROUPS_CHANGED_EVENT, loadGroups);
    };
  }, [enabled]);

  return groups;
}
