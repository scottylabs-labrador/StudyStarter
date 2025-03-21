import {Firestore, FieldValue} from "firebase-admin/firestore";
import {userDetails, groupDetails} from "./types";

export const fetchGroup = async (db: Firestore, id: string) => {
  const docPath = `Study Groups/${id}`;
  const docRef = db.doc(docPath);
  const docSnapshot = await docRef.get();
  return docSnapshot;
};

export const fetchUser = async (db: Firestore, email: string) => {
  const docPath = `Users/${email}`;
  const docRef = db.doc(docPath);
  const docSnapshot = await docRef.get();
  return docSnapshot;
};

export const isUserInGroup = (
  user: Partial<userDetails>,
  group: groupDetails,
): boolean => {
  if (!user.joinedGroups) {
    return false;
  }
  for (const joinedGroup of user.joinedGroups) {
    if (joinedGroup === group.id) {
      return true;
    }
  }
  return false;
};

export const isGroupFull = (group: groupDetails): boolean => {
  const numParticipants = group.participantDetails.length;
  const totalSeats = group.totalSeats;
  return numParticipants >= totalSeats;
};

export const updateGroupMembership = async (
  db: Firestore,
  email: string,
  user: Partial<userDetails>,
  groupId: string,
): Promise<void> => {
  const groupDocPath = `Study Groups/${groupId}`;
  const groupDocRef = db.doc(groupDocPath);
  await groupDocRef.update({
    participantDetails: FieldValue.arrayUnion({
      name: user?.name ?? "Unknown",
      url: user?.imageUrl ?? "",
      email: email,
    }),
  });
  const userDocPath = `Users/${email}`;
  const userDocRef = db.doc(userDocPath);

  await userDocRef.set(
    {
      joinedGroups: FieldValue.arrayUnion(groupId),
    },
    {merge: true},
  );
};
