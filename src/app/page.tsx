"use client";
import { redirect, useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useUser, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion, collection, query, onSnapshot } from 'firebase/firestore';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log("bad turkey");
      return;
    }
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      if (classes == undefined || classes == null || classes.length == 0) {
        router.push("/create_account");
      } else {
        router.push("/feed");
      }
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);
  return (
    <div>
      <SignedOut>
        {redirect("/login")}
        {/* <SignInButton mode="modal" forceRedirectUrl="/create_account">
          <button className="flex items-center rounded-lg px-4 py-2 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">Sign In or Sign Up</button>
        </SignInButton> */}
      </SignedOut>
      {/* <SignedIn>
        {redirect("/feed")}
      </SignedIn> */}
    </div>
  )
}