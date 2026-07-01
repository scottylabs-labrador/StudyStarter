"use client";

import { useEffect, useState } from "react";
import { getUserProfileSummary } from "../services/profileService";
import type { ProfileSummary } from "../types";

export function useProfileSummary(userId?: string, enabled = true) {
  const [profileSummary, setProfileSummary] = useState<ProfileSummary>({});

  useEffect(() => {
    if (!enabled || !userId) {
      setProfileSummary({});
      return;
    }

    const loadProfileSummary = async () => {
      try {
        setProfileSummary(await getUserProfileSummary(userId));
      } catch (error) {
        console.error(error);
        setProfileSummary({});
      }
    };

    void loadProfileSummary();
  }, [enabled, userId]);

  return profileSummary;
}
