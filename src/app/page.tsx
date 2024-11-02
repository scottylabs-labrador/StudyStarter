"use client";
import { redirect, useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getUserPhotos } from "~/lib/api/getUserPhotos";
import { Photo } from "~/types";
import { useEffect, useState } from "react";
import { ClassList } from "~/components/ClassList";

import { db } from '~/lib/api/firebaseConfig';

import { setDoc, doc, collection, query, onSnapshot } from 'firebase/firestore';

function InClass() {
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
  if (classes.length == 0) { redirect("/create_account");}
  else {redirect("/feed");} 
}

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
      setTimeout(() => {
        if (classes.length === 0) { 
          console.log("create");
          router.push("/create_account");
        } else {
          console.log("feed");
          router.push("/feed");
        }
      }, 20);
    };
    doStuff();
  }, [classes, router]);
}
  
  
  
// }

// async function tofeed() {
//   return redirect("/feed");
// }

// async function toaccount() {
//   return redirect("/create_account");
// }
