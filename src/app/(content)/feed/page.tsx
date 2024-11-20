"use client";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot, Timestamp } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";

function formatDateTime(timestamp: Timestamp): [String | null, String | null] {
  if (!timestamp) {
    return [null,null];
  }
  const date = timestamp.toDate()
  const month = String(date.getMonth() + 1).padStart(2, '0');  // getMonth() is 0-indexed (January is 0)
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');


  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' hour should be '12'
  return [`${month}/${day}/${year}`, `${hours}:${minutes} ${ampm}`];
}

function InClass() {
  const { user } = useUser();
  const [classes, setClasses] = useState<any[]>([]);
  const [newClass, setNewClass] = useState({
    title: "",
    professor: "",
    section: "",
  });

  const addClass = () => {
    if (newClass.title && newClass.professor && newClass.section) {
      setNewClass({ title: "", professor: "", section: "" });

      const userId = user?.emailAddresses[0]?.emailAddress;
      const usersDocRef = doc(db, "Users", userId ? userId : "");
      const classesRef = collection(usersDocRef, "Classes");
      setDoc(doc(classesRef, newClass.title), {
        title: newClass.title,
        professor: newClass.professor,
        section: newClass.section,
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const classes = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setClasses(classes);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      },
    );

    return () => unsubscribe();
  }, [user]);
  classes.map((cls) => console.log(cls.id));
  console.log(classes);
  return classes.length > 0;
}

export default function FeedPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const classesRef = collection(db, "Study Groups");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groups = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setGroups(groups);
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user]);

  const [showDetails, setShowDetails] = useState<groupDetails | null>(null);
  const displayScheduled = groups.map((group) => {
    const [formattedDate, formattedTime] = formatDateTime(group.startTime);
    return (
    <div className="max-w-sm overflow-hidden rounded-xl bg-white dark:bg-darkSidebar dark:text-white shadow-lg cursor-pointer px-6 py-4" onClick={() => setShowDetails(group)}>
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Course: &nbsp; </li> <li>{group.course}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Purpose: &nbsp; </li> <li>{group.purpose}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Time: &nbsp; </li> <li>{formattedTime}</li> 
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Date: &nbsp; </li> <li>{formattedDate}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Location: &nbsp; </li> <li>{group.location}</li>
        </ul>
    </div>
  )});

  return (
    <main className="container relative h-screen">
      <div className={`${showDetails ? 'w-[60%]' : 'w-[100%]'}`}>
      <div className={`${showDetails ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-5'}`}>{displayScheduled}</div>
        <div>
          {<Details details={showDetails!} onClick={() => setShowDetails(null)}></Details>}
        </div>
      </div>
    </main>
  );
}