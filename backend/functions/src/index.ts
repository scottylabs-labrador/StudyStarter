import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/v2/https";
import { Request, Response } from "express";
import * as logger from "firebase-functions/logger";
import {groupDetails, userDetails} from "./types";

admin.initializeApp();

const db = admin.firestore();

const fetchGroup = async (id: string) => {
  const docPath = `Study Groups/${id}`;
  const docRef = await db.doc(docPath);
  const docSnapshot = await docRef.get();
  return docSnapshot;
};

const fetchUser = async (email: string) => {
  const docPath = `Users/${email}`;
  const docRef = await db.doc(docPath);
  const docSnapshot = await docRef.get();
  return docSnapshot;
};

const isUserInGroup = (
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

const isGroupFull = (group: groupDetails): boolean => {
  const numParticipants = group.participantDetails.length;
  const totalSeats = group.totalSeats;
  return numParticipants >= totalSeats;
};

const updateGroupMembership = async (
  email: string,
  user: Partial<userDetails>,
  groupId: string,
): Promise<void> => {
  const groupDocPath = `Study Groups/${groupId}`;
  const groupDocRef = db.doc(groupDocPath);
  await groupDocRef.update({
    participantDetails: admin.firestore.FieldValue.arrayUnion({
      name: user?.name ?? "Unknown",
      url: user?.imageUrl ?? "",
      email: email,
    }),
  });

  const userDocPath = `Users/${email}`;
  const userDocRef = db.doc(userDocPath);

  await userDocRef.set(
    {
      joinedGroups: admin.firestore.FieldValue.arrayUnion(groupId),
    },
    {merge: true},
  );
};

export const joinGroup = onRequest(async (request: Request, response: Response) => {
  logger.info("Received add_group request", {structuredData: true});
  if (request.method !== "POST") {
    response.status(405).send({
      success: false,
      message: "Method Not Allowed. Please use POST.",
    });
    return;
  }
  const {id, email} = request.body;
  if (!(id && email)) {
    response.status(400).send({
      success: false,
      message: "Invalid payload. Both 'id' and 'email' are required.",
    });
    return;
  }

  try {
    const groupDocSnapshot = await fetchGroup(id);

    if (!groupDocSnapshot.exists) {
      response.status(404).send({success: false, message: "Group not found."});
      return;
    }

    const group = groupDocSnapshot.data() as groupDetails;

    if (!(group && group.participantDetails)) {
      response.status(404).send({
        success: false,
        message: "Group missing required field: participantDetails.",
      });
      return;
    }

    const userDocSnapshot = await fetchUser(email);

    if (!userDocSnapshot.exists) {
      response.status(404).send({success: false, message: "User not found."});
      return;
    }

    const user = userDocSnapshot.data() as Partial<userDetails>;

    if (!(user && Array.isArray(user.joinedGroups))) {
      response.status(404).send({
        success: false,
        message: "User missing required field: joinedGroups.",
      });
      return;
    }
    if (isUserInGroup(user, group)) {
      response
        .status(404)
        .send({success: false, message: "User already in group."});
      return;
    }
    if (isGroupFull(group)) {
      response.status(404).send({success: false, message: "Group is full."});
      return;
    }

    await updateGroupMembership(email, user, group.id);

    response.status(200).send({success: true, message: "Added user to group."});
    return;
  } catch (error) {
    console.error("Error joining group:", error);
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
