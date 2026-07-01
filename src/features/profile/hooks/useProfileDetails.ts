"use client";

import { useEffect, useState } from "react";
import {
  defaultProfileDetails,
  getUserProfileDetails,
  updateUserProfileDetails,
} from "../services/profileService";
import type { ProfileDetails } from "../types";

export function useProfileDetails(userId?: string) {
  const [profileDetails, setProfileDetails] = useState(defaultProfileDetails);

  useEffect(() => {
    if (!userId) return;

    const loadProfileDetails = async () => {
      try {
        setProfileDetails(await getUserProfileDetails(userId));
      } catch (error) {
        console.error(error);
      }
    };

    loadProfileDetails();
  }, [userId]);

  const updateProfileDetails = async (updates: Partial<ProfileDetails>) => {
    setProfileDetails((currentDetails) => ({ ...currentDetails, ...updates }));

    if (!userId) return;

    try {
      await updateUserProfileDetails(userId, updates);
    } catch (error) {
      console.error(error);
    }
  };

  return { profileDetails, updateProfileDetails };
}
