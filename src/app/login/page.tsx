"use client"
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useEffect, useState } from "react";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion, collection, query, onSnapshot } from 'firebase/firestore';


export default function LoginPage() {
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
      console.log(classes);
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);
    return (
      <main className="flex h-[95vh] flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        </div>
      </main>
    );
  }
  