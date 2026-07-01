import axios from "axios";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import type {
  BlockedUsers,
  BlockingState,
  Course,
  ProfileDetails,
  ProfileSummary,
  ThemePreference,
} from "../types";

type UserProfileDocument = Partial<ProfileDetails> & {
  theme?: unknown;
  blocked?: BlockedUsers;
  joinedGroups?: string[];
};

export const defaultProfileDetails: ProfileDetails = {
  year: "default",
  majors: "",
  minors: "",
};

export async function getUserProfileDetails(
  userId: string,
): Promise<ProfileDetails> {
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return defaultProfileDetails;
  }

  const data = docSnap.data() as UserProfileDocument;
  return {
    year: data.year ?? "default",
    majors: data.majors ?? "",
    minors: data.minors ?? "",
  };
}

export async function getUserProfileSummary(
  userId: string,
): Promise<ProfileSummary> {
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {};
  }

  const data = docSnap.data() as UserProfileDocument;
  return {
    year: data.year,
    majors: data.majors,
    minors: data.minors,
  };
}

export async function updateUserProfileDetails(
  userId: string,
  updates: Partial<ProfileDetails>,
) {
  const usersDocRef = doc(db, "Users", userId);
  await setDoc(usersDocRef, updates, { merge: true });
}

export function subscribeUserCourses(
  userId: string,
  onCourses: (courses: Course[]) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  const usersDocRef = doc(db, "Users", userId);
  const classesRef = collection(usersDocRef, "Classes");
  const classesQuery = query(classesRef);

  return onSnapshot(
    classesQuery,
    (querySnapshot) => {
      const courses = querySnapshot.docs.map((classDoc) => ({
        ...(classDoc.data() as Course),
      }));
      onCourses(courses);
    },
    onError,
  );
}

export async function addUserCourse(userId: string, course: Course) {
  const usersDocRef = doc(db, "Users", userId);
  const classesRef = collection(usersDocRef, "Classes");
  await setDoc(doc(classesRef, course.courseID), course);
}

export async function deleteUserCourse(userId: string, courseID: string) {
  const usersDocRef = doc(db, "Users", userId);
  const classesRef = collection(usersDocRef, "Classes");
  await deleteDoc(doc(classesRef, courseID));
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
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const { theme } = docSnap.data() as UserProfileDocument;
  return theme === "dark" || theme === "light" ? theme : null;
}

export async function updateUserTheme(userId: string, theme: ThemePreference) {
  const usersDocRef = doc(db, "Users", userId);
  await setDoc(usersDocRef, { theme }, { merge: true });
}

export const defaultBlockedUsers: BlockedUsers = {
  blockedByMe: [],
  blockedByThem: [],
};

export async function getUserBlockingState(
  userId: string,
): Promise<BlockingState> {
  const docRef = doc(db, "Users", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { blocked: defaultBlockedUsers, joinedGroups: [] };
  }

  const data = docSnap.data() as UserProfileDocument;
  return {
    blocked: data.blocked ?? defaultBlockedUsers,
    joinedGroups: data.joinedGroups ?? [],
  };
}

export async function updateUserBlockingState({
  userId,
  blocked,
  joinedGroups,
}: {
  userId: string;
  blocked: BlockedUsers;
  joinedGroups?: string[];
}) {
  const updates: { blocked: BlockedUsers; joinedGroups?: string[] } = {
    blocked,
  };

  if (joinedGroups) {
    updates.joinedGroups = joinedGroups;
  }

  await setDoc(doc(db, "Users", userId), updates, { merge: true });
}

export async function addBlockedByThem({
  targetUserId,
  currentUserId,
}: {
  targetUserId: string;
  currentUserId: string;
}) {
  const { blocked } = await getUserBlockingState(targetUserId);
  const blockedByThem = blocked.blockedByThem.includes(currentUserId)
    ? blocked.blockedByThem
    : blocked.blockedByThem.concat(currentUserId);

  await updateUserBlockingState({
    userId: targetUserId,
    blocked: {
      blockedByMe: blocked.blockedByMe,
      blockedByThem,
    },
  });
}

export async function removeBlockedByThem({
  targetUserId,
  currentUserId,
}: {
  targetUserId: string;
  currentUserId: string;
}) {
  const { blocked } = await getUserBlockingState(targetUserId);

  await updateUserBlockingState({
    userId: targetUserId,
    blocked: {
      blockedByMe: blocked.blockedByMe,
      blockedByThem: blocked.blockedByThem.filter(
        (user) => user !== currentUserId,
      ),
    },
  });
}
