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
        setProfileDetails(await getUserProfileDetails());
      } catch (error) {
        console.error(error);
      }
    };

    void loadProfileDetails();
  }, [userId]);

  const updateProfileDetails = async (updates: Partial<ProfileDetails>) => {
    const previousDetails = profileDetails;
    setProfileDetails((currentDetails) => ({ ...currentDetails, ...updates }));

    if (!userId) return;

    try {
      await updateUserProfileDetails(updates);
    } catch (error) {
      console.error(error);
      setProfileDetails(previousDetails);
    }
  };

  return { profileDetails, updateProfileDetails };
}
