import axios from "axios";

import {
  fetchProfile,
  fetchTheme,
  updateProfile,
  updateTheme,
} from "./profileApi";
import type {
  Course,
  ProfileDetails,
  ProfileSummary,
  ThemePreference,
} from "../types";

export const defaultProfileDetails: ProfileDetails = {
  year: "default",
  majors: "",
  minors: "",
};

export async function getUserProfileDetails(
  userId: string,
): Promise<ProfileDetails> {
  void userId;
  const profile = await fetchProfile();
  return {
    year: profile.year,
    majors: profile.majors,
    minors: profile.minors,
  };
}

export async function getUserProfileSummary(
  userId: string,
): Promise<ProfileSummary> {
  void userId;
  const profile = await fetchProfile();
  return {
    year: profile.year,
    majors: profile.majors,
    minors: profile.minors,
  };
}

export async function updateUserProfileDetails(
  userId: string,
  updates: Partial<ProfileDetails>,
) {
  void userId;
  await updateProfile(updates);
}

export async function getAllCourses(): Promise<Course[]> {
  const response = await axios.get<Course[]>(
    "https://course-tools.apis.scottylabs.org/courses/all",
  );
  return response.data;
}

export async function getUserTheme(
  userId: string,
): Promise<ThemePreference | null> {
  void userId;
  return fetchTheme();
}

export async function updateUserTheme(userId: string, theme: ThemePreference) {
  void userId;
  await updateTheme(theme);
}
