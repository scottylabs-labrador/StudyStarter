"use client";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";

function formatTime(timeString) {
  // Combine with a dummy date to parse correctly
  const date = new Date(`1970-01-01T${timeString}:00Z`); // Adding `:00` for seconds and `Z` for UTC

  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' hour should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes; // pad minutes with zero if needed

  return `${hours}:${minutes} ${ampm}`;
}
function formatDate(dateString) {
  const date = new Date(dateString); // assuming dateString is the stored date in year-month-day format
  const month = date.getMonth() + 1; // months are 0-indexed
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
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

  const displayScheduled = groups.map((group) => (
    <div className="max-w-sm overflow-hidden rounded-xl bg-white dark:bg-darkSidebar dark:text-white shadow-lg cursor-pointer px-6 py-4" onClick={() => setShowDetails(group)}>
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Course: &nbsp; </li> <li>{group.course}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Purpose: &nbsp; </li> <li>{group.purpose}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Time: &nbsp; </li> <li>{formatTime(group.time)}</li> 
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Date: &nbsp; </li> <li>{formatDate(group.date)}</li>
        </ul>
        <ul style={{ display: 'flex', flexDirection: 'row' }}>
          <li className="font-bold" > Location: &nbsp; </li> <li>{group.location}</li>
        </ul>
    </div>
  ));

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