"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { fetchGroups, subscribeToGroupChanges } from "../services/groupApi";

export function useStudyGroups(enabled: boolean) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let requestVersion = 0;
    const loadGroups = () => {
      const currentRequest = ++requestVersion;
      void fetchGroups()
        .then((nextGroups) => {
          if (!cancelled && currentRequest === requestVersion) {
            setGroups(nextGroups);
          }
        })
        .catch((error) => console.error("Error getting groups:", error));
    };

    loadGroups();
    const unsubscribe = subscribeToGroupChanges(loadGroups);
    const refreshInterval = window.setInterval(loadGroups, 30_000);

    return () => {
      cancelled = true;
      unsubscribe();
      window.clearInterval(refreshInterval);
    };
  }, [enabled]);

  return groups;
}
