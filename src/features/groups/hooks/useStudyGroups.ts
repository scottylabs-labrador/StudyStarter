"use client";

import { useEffect, useState } from "react";
import groupDetails from "~/types";
import { subscribeStudyGroups } from "../services/groupService";

export function useStudyGroups(enabled: boolean) {
  const [groups, setGroups] = useState<groupDetails[]>([]);

  useEffect(() => {
    if (!enabled) return;

    return subscribeStudyGroups(
      setGroups,
      (error) => console.error("Error getting documents: ", error),
    );
  }, [enabled]);

  return groups;
}
