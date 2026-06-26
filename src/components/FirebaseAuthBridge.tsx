"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getAuth, signInWithCustomToken } from "firebase/auth";

import { authClient } from "~/lib/auth-client";
import { firebaseApp } from "~/lib/api/firebaseConfig";

export function FirebaseAuthBridge({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const userId = session.data?.user?.id;

    if (session.isPending) {
      setIsFirebaseReady(false);
      return;
    }

    if (!userId) {
      setIsFirebaseReady(true);
      return;
    }

    const firebaseAuth = getAuth(firebaseApp);

    if (firebaseAuth.currentUser?.uid === userId) {
      setIsFirebaseReady(true);
      return;
    }

    const abortController = new AbortController();
    setIsFirebaseReady(false);

    async function signInToFirebase() {
      const response = await fetch("/api/firebase-token", {
        method: "POST",
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get Firebase custom token");
      }

      const { token } = (await response.json()) as { token: string };

      if (!abortController.signal.aborted) {
        await signInWithCustomToken(firebaseAuth, token);
        setIsFirebaseReady(true);
      }
    }

    void signInToFirebase().catch((error) => {
      if (!abortController.signal.aborted) {
        console.error("Firebase sign-in failed:", error);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [session.data?.user?.id, session.isPending]);

  if (!isFirebaseReady) {
    return null;
  }

  return <>{children}</>;
}
