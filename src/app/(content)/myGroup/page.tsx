"use client";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import formatDateTime from "~/helpers/date_helper";
import { MultiValue } from "react-select";
import TopFilterBar from "~/components/FilterBar";
import { returnUserGroups } from "~/helpers/firebase_helper";

// function InClass() {
//   const { user } = useUser();
//   const [classes, setClasses] = useState<{ value: string; label: string }[]>(
//     [],
//   );
//   const [newClass, setNewClass] = useState({
//     title: "",
//     professor: "",
//     section: "",
//   });

//   const addClass = () => {
//     if (newClass.title && newClass.professor && newClass.section) {
//       setNewClass({ title: "", professor: "", section: "" });

//       const userId = user?.emailAddresses[0]?.emailAddress;
//       const usersDocRef = doc(db, "Users", userId ? userId : "");
//       const classesRef = collection(usersDocRef, "Classes");
//       setDoc(doc(classesRef, newClass.title), {
//         title: newClass.title,
//         professor: newClass.professor,
//         section: newClass.section,
//       });
//     }
//   };

//   useEffect(() => {
//     if (!user) return;
//     const userId = user?.emailAddresses[0]?.emailAddress;
//     const usersDocRef = doc(db, "Users", userId ? userId : "");
//     const classesRef = collection(usersDocRef, "Classes");
//     const q = query(classesRef);

//     const unsubscribe = onSnapshot(
//       q,
//       (querySnapshot) => {
//         const classOptions = querySnapshot.docs.map((doc) => ({
//           value: doc.id,
//           label: doc.id,
//         }));
//         setClasses(classOptions);
//       },
//       (error) => {
//         console.error("Error getting documents: ", error);
//       },
//     );

//     return () => unsubscribe();
//   }, [user]);

//   return classes.length > 0;
// }

export default function FeedPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const { user } = useUser();
  const [selectedCourses, setSelectedCourses] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedLocations, setSelectedLocations] = useState<
    MultiValue<{ value: string; label: string }>
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [classes, setClasses] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [joinedGroups, setJoinedGroups] = useState<string[] | null>(null);
  const [showDetails, setShowDetails] = useState<groupDetails | null>(null);
  const [showFullFilter, setShowFullFilter] = useState<boolean>(false);
  const [updateCardColors, setUpdateCardColors] = useState<boolean>(false); // Used to activate UseEffect
  const cardColorMapping = new Map<boolean, [string, string]>([
    [true, ["darkAccent", "darkAccent"]],
    [false, ["white", "darkSidebar"]],
  ]);

  useEffect(() => {
    if (!user) return;
    const classesRef = collection(db, "Study Groups");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const updatedGroups = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        updatedGroups.sort((a, b) => a.startTime - b.startTime);
        setGroups(updatedGroups);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      },
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const classOptions = querySnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.id,
        }));
        setClasses(classOptions);
      },
      (error) => {
        console.error("Error getting documents: ", error);
      },
    );
    return () => unsubscribe();
  }, [user]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const updatedJoinedGroups = await returnUserGroups(db, user);
      setJoinedGroups(updatedJoinedGroups);
    })();
  }, [user, updateCardColors]);

  const displayScheduled = groups.map((group) => {
    const [formattedDate, formattedTime] = formatDateTime(group.startTime);
    const [lightColor, darkColor] = cardColorMapping.get(
      joinedGroups ? joinedGroups.includes(group.id) : false,
    )!;
    const isParticipant = joinedGroups?.includes(group.id);
    if (!isParticipant) return;
    return (
      <div
        className={`max-w-sm cursor-pointer overflow-hidden rounded-xl bg-${lightColor} px-6 py-4 shadow-lg dark:bg-${darkColor} dark:text-white`}
        onClick={() => setShowDetails(group)}
      >
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold"> Course: &nbsp; </li>{" "}
          <li>{group.course}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold"> Purpose: &nbsp; </li>{" "}
          <li>{group.purpose}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold"> Time: &nbsp; </li> <li>{formattedTime}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold"> Date: &nbsp; </li> <li>{formattedDate}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold"> Location: &nbsp; </li>{" "}
          <li>{group.location}</li>
        </ul>
      </div>
    );
  });

  const locationOptions = [
    { value: "Gates", label: "Gates" },
    { value: "Wean", label: "Wean" },
    { value: "Zoom", label: "Zoom" },
    { value: "Doherty", label: "Doherty" },
    { value: "Posner", label: "Posner" },
    { value: "Porter", label: "Porter" },
    { value: "Mudge", label: "Mudge" },
    { value: "Stever", label: "Stever" },
    { value: "Hammerschlag", label: "Hammerschlag" },
  ];

  return (
    <main className="container relative h-screen">
      <TopFilterBar
        courseOptions={classes}
        locationOptions={locationOptions}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <div className={`pt-[60px] ${showDetails ? "w-[60%]" : "w-[100%]"}`}>
        <div
          className={`${showDetails ? "grid grid-cols-2 gap-4" : "grid grid-cols-3 gap-5"}`}
        >
          {displayScheduled}
        </div>
        <div>
          {
            <Details
              details={showDetails!}
              onClick={() => setShowDetails(null)}
              updateCardColors={setUpdateCardColors}
            ></Details>
          }
        </div>
      </div>
    </main>
  );
}
