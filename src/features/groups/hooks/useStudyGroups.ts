"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { subscribeStudyGroups } from "../services/groupService";

export function useStudyGroups(enabled: boolean) {
  const [groups, setGroups] = useState<StudyGroup[]>([]);

  useEffect(() => {
    if (!enabled) return;

    return subscribeStudyGroups(setGroups, (error) =>
      console.error("Error getting documents: ", error),
    );
  }, [enabled]);

  return groups;
}
