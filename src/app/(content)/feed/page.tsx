"use client";
import Card from "~/components/Card";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot, doc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { formatDateTime, isInThePast } from "~/helpers/date_helper";
import { MultiValue } from "react-select";
import TopFilterBar from "~/components/FilterBar";
import { returnUserGroups } from "~/helpers/firebase_helper";

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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<groupDetails | null>(null);
  const [showFullFilter, setShowFullFilter] = useState<boolean>(false);
  const cardColorMapping = new Map<boolean, [string, string]>([
    [true, ['lightAccent', "darkAccent"]],
    [false, ["lightSidebar", "darkSidebar"]],
  ]);
  const handleCardClick = (group: any) => {
    setSelectedGroup(group.id);
    setShowDetails(group);
  }
  const shouldFilter = (group: groupDetails) => {
    const isFull = group.participantDetails.length >= group.totalSeats;
    const isParticipant = joinedGroups?.includes(group.id);
    const groupDate = group.startTime.toDate();
    if (isFull && !showFullFilter && !isParticipant) {
      return true;
    }
    if (isInThePast(group.startTime)) return true;

    if (selectedDate) {
      if (
        groupDate.getDate() !== selectedDate.getDate() ||
        groupDate.getMonth() !== selectedDate.getMonth() ||
        groupDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        return true;
      }
    }
    if (selectedLocations.length > 0) {
      if (!selectedLocations.some((entry) => entry.value === group.location)) {
        return true;
      }
    }
    if (selectedCourses.length > 0) {
      if (!selectedCourses.some((entry) => entry.value === group.course)) {
        return true;
      }
    }
    return false;
  };

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
    const userId = user.emailAddresses[0]?.emailAddress;
  
    const userDocRef = doc(db, "Users", userId ? userId : "");
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setJoinedGroups(data.joinedGroups || []);
      }
    });
  
    return () => unsubscribe();
  }, [user]);

  const displayScheduled = groups.map((group) => {
    const [formattedDate, formattedTime] = formatDateTime(group.startTime);
    // const [lightColor, darkColor] = cardColorMapping.get(
    //   joinedGroups ? joinedGroups.includes(group.id) : false,
    // )!;
    const isInGroup = joinedGroups ? joinedGroups.includes(group.id) : false;
    const [lightColor, darkColor] = cardColorMapping.get(group.id === selectedGroup)!;
    if (shouldFilter(group)) return;
    return (
      <div
        className={`my-3 max-w-sm cursor-pointer overflow-hidden rounded-xl bg-${lightColor} dark:bg-${darkColor} px-6 py-4 shadow-lg text-black dark:text-white ${(group.id == selectedGroup) ? 'border-2' : ''}`}
        onClick={() => handleCardClick(group)}
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
        {isInGroup && <ul style={{ display: "flex", flexDirection: "row", justifyContent: "right"}}>
          <li className="bg-joined text-joinedText px-3 py-1 rounded-md -mt-8">Joined</li>
        </ul>}
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

  let showNone = true;
  displayScheduled.forEach( (group) => {
    if (group != undefined) showNone = false;
  })

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

  <div className="pt-[60px]">
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
      {/* Display Scheduled Section */}
      <div
        className={`${
          showDetails ? "md:col-span-2" : "md:col-span-3"
        }`}
      >
        <div
          className={`grid gap-5 ${
            showNone ? "justify-center" : "md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {showNone ? (
            <p className="text-black dark:text-white">No groups found</p>
          ) : (
            displayScheduled
          )}
        </div>
      </div>

      {/* Card Section */}
      {showDetails && (
        <div className="md:block md:w-full lg:w-[30%] xl:w-[25%]">
          <Card
            details={showDetails}
            onClick={() => setShowDetails(null)}
            updateJoinedGroups={setJoinedGroups}
          />
        </div>
      )}
    </div>
  </div>
</main>

  );
}
