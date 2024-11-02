"use client";
import { redirect, useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import { db } from '~/lib/api/firebaseConfig';

import { setDoc, doc, collection, query, onSnapshot } from 'firebase/firestore';

export default function HomePage() {
  const { user } = useUser();
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setClasses(classes);
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);
  classes.map((cls) => (
    console.log(cls.id)
  ))
  console.log(classes);

  const router = useRouter();

  useEffect(() => {
    const doStuff = () => {
      const id = setInterval(() => {
        if (classes.length != 0) { 
          console.log("feed");
          router.push("/feed");
        }
      }, 10);
      setTimeout(() => {
        if (classes.length === 0) { 
          console.log("create");
          router.push("/create_account");
        } else {
          console.log("feed");
          router.push("/feed");
        }
        clearInterval(id);
      }, 1000);
    };
    doStuff();
  }, [classes, router]);
}