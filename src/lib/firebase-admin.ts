import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdminPrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing FIREBASE_PRIVATE_KEY");
  }

  return privateKey.replace(/\\n/g, "\n");
}

function getFirebaseAdminCredential() {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID");
  }

  if (!clientEmail) {
    throw new Error("Missing FIREBASE_CLIENT_EMAIL");
  }

  return cert({
    projectId,
    clientEmail,
    privateKey: getFirebaseAdminPrivateKey(),
  });
}

export function getAdminApp() {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp({
    credential: getFirebaseAdminCredential(),
  });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
