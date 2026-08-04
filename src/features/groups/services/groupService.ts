import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  writeBatch,
  type DocumentReference,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import type { BlockedUsers } from "~/features/profile/types";
import type { StudyGroup } from "~/types";

export type UserGroupState = {
  joinedGroups: string[];
  blockedUsers: string[];
};

type UserGroupDocument = {
  joinedGroups?: string[];
  blocked?: BlockedUsers;
};

export function subscribeStudyGroups(
  onGroups: (groups: StudyGroup[]) => void,
  onError: (error: unknown) => void,
): Unsubscribe {
  const groupsRef = collection(db, "StudyGroups");
  const groupsQuery = query(groupsRef);

  return onSnapshot(
    groupsQuery,
    (querySnapshot) => {
      const groups = querySnapshot.docs.map((groupDoc) => ({
        ...(groupDoc.data() as StudyGroup),
      }));
      groups.sort(
        (firstGroup, secondGroup) =>
          firstGroup.startTime.toMillis() - secondGroup.startTime.toMillis(),
      );
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

    const data = docSnap.data() as UserGroupDocument;
    const blocked: BlockedUsers = data.blocked ?? {
      blockedByMe: [],
      blockedByThem: [],
    };
    onUserGroupState({
      joinedGroups: data.joinedGroups ?? [],
      blockedUsers: blocked.blockedByMe
        .concat(blocked.blockedByThem)
        .map((email) => email.toLowerCase()),
    });
  });
}

export function subscribeStudyGroup(
  groupId: string,
  onGroup: (group: StudyGroup) => void,
  onMissing: () => void,
): Unsubscribe {
  const groupDocRef = doc(db, "StudyGroups", groupId);

  return onSnapshot(groupDocRef, (docSnapshot) => {
    if (!docSnapshot.exists()) {
      onMissing();
      return;
    }

    onGroup(docSnapshot.data() as StudyGroup);
  });
}

const generateGroupId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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

  const batch = writeBatch(db);
  batch.set(groupDocRef, group);
  batch.set(
    doc(db, "Users", participant.email),
    { joinedGroups: arrayUnion(id) },
    { merge: true },
  );
  await batch.commit();

  return group;
}

export async function updateStudyGroup({
  group,
  input,
}: {
  group: StudyGroup;
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

  const data = userDoc.data() as UserGroupDocument;
  const blocked: BlockedUsers = data.blocked ?? {
    blockedByMe: [],
    blockedByThem: [],
  };
  return blocked.blockedByMe
    .concat(blocked.blockedByThem)
    .map((email) => email.toLowerCase());
}

export async function getStudyGroup(groupId: string) {
  const groupDocSnap = await getDoc(doc(db, "StudyGroups", groupId));
  return groupDocSnap.exists() ? (groupDocSnap.data() as StudyGroup) : null;
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
  const groupDocRef = doc(db, "StudyGroups", groupId);
  const userDocRef = doc(db, "Users", userId);

  return runTransaction(db, async (transaction) => {
    const groupDoc = await transaction.get(groupDocRef);

    if (!groupDoc.exists()) {
      throw new Error("Group unavailable");
    }

    const groupData = groupDoc.data() as StudyGroup;
    const participantDetails = groupData.participantDetails ?? [];
    const isAlreadyParticipant = participantDetails.some(
      (existingParticipant) => existingParticipant.email === participant.email,
    );

    if (
      !isAlreadyParticipant &&
      participantDetails.length >= groupData.totalSeats
    ) {
      throw new Error("Group is full");
    }

    const updatedParticipants = isAlreadyParticipant
      ? participantDetails
      : participantDetails.concat(participant);

    transaction.update(groupDocRef, {
      participantDetails: updatedParticipants,
    });
    transaction.set(
      userDocRef,
      { joinedGroups: arrayUnion(groupId) },
      { merge: true },
    );

    return updatedParticipants;
  });
}

export async function removeParticipantFromGroup({
  group,
  userId,
  userEmail,
}: {
  group: StudyGroup;
  userId: string;
  userEmail: string;
}) {
  const groupDocRef = doc(db, "StudyGroups", group.id);
  const userDocRef = doc(db, "Users", userId);

  return runTransaction(db, async (transaction) => {
    const groupDoc = await transaction.get(groupDocRef);

    transaction.set(
      userDocRef,
      { joinedGroups: arrayRemove(group.id) },
      { merge: true },
    );

    if (!groupDoc.exists()) {
      return [];
    }

    const groupData = groupDoc.data() as StudyGroup;
    const remainingParticipants = (groupData.participantDetails ?? []).filter(
      (participantDetail) => participantDetail.email !== userEmail,
    );

    if (remainingParticipants.length === 0) {
      transaction.delete(groupDocRef);
    } else {
      transaction.update(groupDocRef, {
        participantDetails: remainingParticipants,
      });
    }

    return remainingParticipants;
  });
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
      console.warn(
        "Missing group while removing blocked participant:",
        groupId,
      );
      continue;
    }

    const groupData = groupDoc.data() as StudyGroup;
    const groupParticipants = groupData.participantDetails ?? [];
    const eventId = groupParticipants.find(
      (participant) => participant.email === userEmail,
    )?.eventId;

    if (eventId && eventId !== "None") {
      eventIdsToDelete.push(eventId);
    } else {
      console.warn("No calendar event found to delete for group", groupId);
    }

    await updateDoc(groupDocRef, {
      participantDetails: groupParticipants.filter(
        (participant) => participant.email !== userEmail,
      ),
    });
  }

  return { remainingGroupIds, eventIdsToDelete };
}
