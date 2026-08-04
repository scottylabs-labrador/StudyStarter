"use client";

import { useEffect, useState } from "react";
import { subscribeUserGroupState } from "../services/groupService";

export function useUserGroupState(userId?: string) {
  const [joinedGroups, setJoinedGroups] = useState<string[] | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    return subscribeUserGroupState(userId, ({ joinedGroups, blockedUsers }) => {
      setJoinedGroups(joinedGroups);
      setBlockedUsers(blockedUsers);
    });
  }, [userId]);

  return { joinedGroups, setJoinedGroups, blockedUsers };
}
