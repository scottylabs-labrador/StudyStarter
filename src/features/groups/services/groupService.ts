import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentReference,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import type { BlockedUsers } from "~/features/profile/types";
import groupDetails from "~/types";

export type UserGroupState = {
  joinedGroups: string[];
  blockedUsers: string[];
};

export function subscribeStudyGroups(
  onGroups: (groups: groupDetails[]) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  const groupsRef = collection(db, "StudyGroups");
  const groupsQuery = query(groupsRef);

  return onSnapshot(
    groupsQuery,
    (querySnapshot) => {
      const groups = querySnapshot.docs.map((groupDoc) => ({
        ...(groupDoc.data() as groupDetails),
      }));
      groups.sort((firstGroup, secondGroup) => (
        firstGroup.startTime.toMillis() - secondGroup.startTime.toMillis()
      ));
      onGroups(groups);
    },
    onError,
  );
}

export function subscribeUserGroupState(
  userId: string,
  onUserGroupState: (state: UserGroupState) => void,
): Unsubscribe {
  const userDocRef = doc(db, "Users", userId);

  return onSnapshot(userDocRef, (docSnap) => {
    if (!docSnap.exists()) {
      onUserGroupState({ joinedGroups: [], blockedUsers: [] });
      return;
    }

    const data = docSnap.data();
    const blocked: BlockedUsers = data.blocked || { blockedByMe: [], blockedByThem: [] };
    onUserGroupState({
      joinedGroups: data.joinedGroups || [],
      blockedUsers: blocked.blockedByMe.concat(blocked.blockedByThem),
    });
  });
}

export function subscribeStudyGroup(
  groupId: string,
  onGroup: (group: groupDetails) => void,
  onMissing: () => void,
): Unsubscribe {
  const groupDocRef = doc(db, "StudyGroups", groupId);

  return onSnapshot(groupDocRef, (docSnapshot) => {
    if (!docSnapshot.exists()) {
      onMissing();
      return;
    }

    onGroup(docSnapshot.data() as groupDetails);
  });
}

const generateGroupId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let index = 0; index < 20; index++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
};

async function documentExists(docRef: DocumentReference): Promise<boolean> {
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getAvailableGroupRef() {
  let id = generateGroupId();
  let groupDocRef = doc(db, "StudyGroups", id);

  while (await documentExists(groupDocRef)) {
    id = generateGroupId();
    groupDocRef = doc(db, "StudyGroups", id);
  }

  return { id, groupDocRef };
}

export type GroupParticipant = {
  name: string;
  url: string | null;
  email: string;
  eventId?: string;
  event?: string;
};

export type GroupFormInput = {
  title: string;
  course: string;
  purpose: string;
  date: Date;
  location: string;
  seats: string;
  details: string;
};

export async function createStudyGroup({
  input,
  participant,
}: {
  input: GroupFormInput;
  participant: GroupParticipant;
}) {
  const { id, groupDocRef } = await getAvailableGroupRef();
  const firestoreTimestamp = Timestamp.fromDate(input.date);

  const group = {
    id,
    title: input.title,
    course: input.course,
    purpose: input.purpose,
    startTime: firestoreTimestamp,
    location: input.location,
    totalSeats: Number(input.seats),
    participantDetails: [participant],
    details: input.details,
  };

  await setDoc(groupDocRef, group);
  await setDoc(
    doc(db, "Users", participant.email),
    { joinedGroups: arrayUnion(id) },
    { merge: true },
  );

  return group;
}

export async function updateStudyGroup({
  group,
  input,
}: {
  group: groupDetails;
  input: GroupFormInput;
}) {
  const firestoreTimestamp = Timestamp.fromDate(input.date);
  const updatedGroup = {
    id: group.id,
    title: input.title,
    course: input.course,
    purpose: input.purpose,
    startTime: firestoreTimestamp,
    location: input.location,
    totalSeats: Number(input.seats),
    participantDetails: group.participantDetails,
    details: input.details,
  };

  await updateDoc(doc(db, "StudyGroups", group.id), {
    title: updatedGroup.title,
    course: updatedGroup.course,
    purpose: updatedGroup.purpose,
    startTime: updatedGroup.startTime,
    location: updatedGroup.location,
    totalSeats: updatedGroup.totalSeats,
    participantDetails: updatedGroup.participantDetails,
    details: updatedGroup.details,
  });

  return updatedGroup;
}

export async function getUserBlockedEmails(userId: string) {
  const userDoc = await getDoc(doc(db, "Users", userId));

  if (!userDoc.exists()) return [];

  const blocked: BlockedUsers = userDoc.data().blocked || {
    blockedByMe: [],
    blockedByThem: [],
  };
  return blocked.blockedByMe.concat(blocked.blockedByThem);
}

export async function getStudyGroup(groupId: string) {
  const groupDocSnap = await getDoc(doc(db, "StudyGroups", groupId));
  return groupDocSnap.exists() ? (groupDocSnap.data() as groupDetails) : null;
}

export async function addParticipantToGroup({
  groupId,
  userId,
  participant,
}: {
  groupId: string;
  userId: string;
  participant: GroupParticipant;
}) {
  await updateDoc(doc(db, "StudyGroups", groupId), {
    participantDetails: arrayUnion(participant),
  });
  await setDoc(
    doc(db, "Users", userId),
    { joinedGroups: arrayUnion(groupId) },
    { merge: true },
  );
}

export async function removeParticipantFromGroup({
  group,
  userId,
  userEmail,
}: {
  group: groupDetails;
  userId: string;
  userEmail: string;
}) {
  const remainingParticipants = group.participantDetails.filter(
    (participantDetail) => participantDetail.email !== userEmail,
  );

  const groupDocRef = doc(db, "StudyGroups", group.id);
  await updateDoc(groupDocRef, {
    participantDetails: remainingParticipants,
  });
  await setDoc(
    doc(db, "Users", userId),
    { joinedGroups: arrayRemove(group.id) },
    { merge: true },
  );

  if (remainingParticipants.length === 0) {
    await deleteDoc(groupDocRef);
  }

  return remainingParticipants;
}

export async function removeParticipantFromSharedGroups({
  currentGroupIds,
  targetGroupIds,
  userEmail,
}: {
  currentGroupIds: string[];
  targetGroupIds: string[];
  userEmail: string;
}) {
  const remainingGroupIds: string[] = [];
  const eventIdsToDelete: string[] = [];

  for (const groupId of currentGroupIds) {
    if (!targetGroupIds.includes(groupId)) {
      remainingGroupIds.push(groupId);
      continue;
    }

    const groupDocRef = doc(db, "StudyGroups", groupId);
    const groupDoc = await getDoc(groupDocRef);

    if (!groupDoc.exists()) {
      console.warn("Missing group while removing blocked participant:", groupId);
      continue;
    }

    const groupData = groupDoc.data() as groupDetails;
    const groupParticipants = groupData.participantDetails ?? [];
    const eventId = groupParticipants.find((participant) => (
      participant.email === userEmail
    ))?.eventId;

    if (eventId && eventId !== "None") {
      eventIdsToDelete.push(eventId);
    } else {
      console.warn("No calendar event found to delete for group", groupId);
    }

    await updateDoc(groupDocRef, {
      participantDetails: groupParticipants.filter((participant) => (
        participant.email !== userEmail
      )),
    });
  }

  return { remainingGroupIds, eventIdsToDelete };
}
