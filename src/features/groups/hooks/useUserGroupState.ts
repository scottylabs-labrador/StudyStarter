"use client";

import { useEffect, useState } from "react";
import { fetchBlockingState } from "~/features/profile/services/profileApi";
import { GROUPS_CHANGED_EVENT } from "~/features/groups/services/groupApi";

export function useUserGroupState(userId?: string) {
  const [joinedGroups, setJoinedGroups] = useState<string[] | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    const loadState = () => {
      void fetchBlockingState()
        .then(({ joinedGroups, blockedByMe, blockedByThem }) => {
          if (cancelled) return;
          setJoinedGroups(joinedGroups);
          setBlockedUsers(
            blockedByMe
              .concat(blockedByThem)
              .map((email) => email.toLowerCase()),
          );
        })
        .catch((error) =>
          console.error("Error getting blocking state:", error),
        );
    };

    loadState();
    window.addEventListener(GROUPS_CHANGED_EVENT, loadState);

    return () => {
      cancelled = true;
      window.removeEventListener(GROUPS_CHANGED_EVENT, loadState);
    };
  }, [userId]);

  return { joinedGroups, setJoinedGroups, blockedUsers };
}
