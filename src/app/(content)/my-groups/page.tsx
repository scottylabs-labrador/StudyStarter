"use client";
import GroupDetails from "~/features/groups/components/GroupDetails";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot, doc } from "firebase/firestore";
import { useUser } from "~/lib/auth-client";
import { formatDateTime, isInThePast } from "~/helpers/date_helper";
import { MultiValue } from "react-select";
import TopFilterBar from "~/features/groups/components/FilterBar";
import Card from "~/features/groups/components/Card";

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
  const [classes, setClasses] = useState<{ value: string; label: string }[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[] | null>(null);
  const [showDetails, setShowDetails] = useState<groupDetails | null>(null);
  const shouldFilter = (group: groupDetails) => {
    const groupDate = group.startTime.toDate();
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

    const classesRef = collection(db, "StudyGroups");
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
      const userId = user.emailAddresses[0]?.emailAddress;
    
      if (!userId) {
        return;
      }
      const userDocRef = doc(db, "Users", userId);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setJoinedGroups(data.joinedGroups || []);
        }
      });
    
      return () => unsubscribe();
    }, [user]);

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
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

  const displayScheduled = groups.map((group) => {
    const [formattedDate, formattedTime] = formatDateTime(group.startTime);
    const isParticipant = joinedGroups?.includes(group.id);
    if (!isParticipant) return;
    if (shouldFilter(group)) return;
    return (
      <Card
        onClick={() => setShowDetails(group)}
        group={group}
        time={formattedTime}
        date={formattedDate}
        isInGroup={true}
        lightColor={"lightAccent"}
        darkColor={"darkAccent"}
      />
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

  <div className="pt-[20px]">
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

      {/* GroupDetails Section */}
      {showDetails && (
        <div
          className="details-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowDetails(null)}
        >
          <div className="details-overlay-inner" onClick={(e) => e.stopPropagation()}>
            <GroupDetails
              details={showDetails}
              onClick={() => setShowDetails(null)}
              updateJoinedGroups={setJoinedGroups}
            />
          </div>
        </div>
      )}
    </div>
  </div>
</main>
  );
}
