export type Course = {
  name: string;
  courseID: string;
  id: string;
};

export type ProfileDetails = {
  year: string;
  majors: string;
  minors: string;
};

export type ProfileSummary = Partial<ProfileDetails>;

export type BlockedUsers = {
  blockedByMe: string[];
  blockedByThem: string[];
};

export type BlockingState = {
  blocked: BlockedUsers;
  joinedGroups: string[];
};

export type ThemePreference = "light" | "dark";
