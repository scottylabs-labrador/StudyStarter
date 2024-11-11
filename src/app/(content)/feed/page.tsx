"use client";
import { use, useState } from "react";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { setDoc, doc, collection, query, onSnapshot } from "firebase/firestore";
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


  const scheduled: groupDetails[]=[
  {
    title: "Concepts Preparation",
    numParticipants: 3,
    totalSeats: 4,
    purpose: "",
    date:"",
    location: "Giant Eagle",
    time: "Sun, Oct 6: 4:00 - 5:00pm",
    course: "21-127",
    participantDetails: [
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
      { name: "Jane Doe", url: "assets/Jane Doe.webp" },
      { name: "John Deer", url: "assets/John Deer.jpg" },
    ],
    details: "This is for Greggo's Class, not Newstead's!",
  },

  {
    title: "ECE Preparation",
    numParticipants: 2,
    totalSeats: 10,
    purpose: "",
    location: "Hunt",
    date:"",
    time: "Sun, Oct 12: 4:00 - 5:00pm",
    course: "18-100",
    participantDetails: [
      { name: "Sylvia Smith", url: "assets/Jane Doe.webp" },
      { name: "Anika Suktanker", url: "assets/John Deer.jpg" },
    ],
    details: "We are preparing for the upcomming test 2! WE NEED SOMEONE SMART PLEASE",
  },
  {
    title: "ECE Preparation",
    numParticipants: 2,
    totalSeats: 10,
    purpose: "",
    location: "Hunt",
    date:"",
    time: "Sun, Oct 12: 4:00 - 5:00pm",
    course: "18-100",
    participantDetails: [
      { name: "Sylvia Smith", url: "assets/Jane Doe.webp" },
      { name: "Anika Suktanker", url: "assets/John Deer.jpg" },
    ],
    details: "We are preparing for the upcomming test 2! WE NEED SOMEONE SMART PLEASE",
  },
  {
    title: "ECE Preparation",
    numParticipants: 2,
    totalSeats: 10,
    purpose: "",
    location: "Hunt",
    date:"",
    time: "Sun, Oct 12: 4:00 - 5:00pm",
    course: "18-100",
    participantDetails: [
      { name: "Sylvia Smith", url: "assets/Jane Doe.webp" },
      { name: "Anika Suktanker", url: "assets/John Deer.jpg" },
    ],
    details: "We are preparing for the upcomming test 2! WE NEED SOMEONE SMART PLEASE",
  }
];

const open: groupDetails[]=[
  {
    title: "GRINDING SESSION",
    numParticipants: 1,
    totalSeats: 4,
    purpose: "",
    location: "Sorrels",
    date:"",
    time: "Sun, Oct 4: 4:00 - 10:00pm",
    course: "15-112",
    participantDetails: [
      { name: "Jane Doe", url: "assets/Jane Doe.webp" }
    ],
    details: "I am grinding my homework just join me",
  }
];
const displayDetails = () => {
  // Ensure the study group selection for details card is the same as the currently open tab
  if (showDetails && showDetails[1] == tabOpen) {
    return showDetails;
  }
  return null;
};
 
  const [showDetails, setShowDetails] = useState<[groupDetails, "Open" | "Scheduled"] | null>(null); // index 1 for open or scheduled
  const [tabOpen, setTabOpen] = useState<"Open" | "Scheduled">("Scheduled");

  const displayOpens = open.map((group) => (
    <div
      className="max-w-sm cursor-pointer overflow-hidden rounded bg-white shadow-lg"
      onClick={() => setShowDetails([group, "Open"])}
    >
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul>
          <li>{group.course}</li>
          <li>{group.purpose}</li>
          <li>{group.time}</li>
          <li>{group.date}</li>
          <li>{group.location}</li>
          <li>{group.totalSeats}</li>
        </ul>
      </div>
    </div>
  ));

  const displayScheduled = groups.map((group) => (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg cursor-pointer" onClick={() => setShowDetails([group, "Scheduled"])}>
      <div className="px-6 py-4">
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
    </div>
  ));

  return (
    <main className="container relative h-screen">
      <div className={`${showDetails ? 'flex' : 'w-full'}`}>
        <div className={`${showDetails ? 'w-[60%]' : 'w-[100%]'}`}>
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="-mb-px flex flex-wrap"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li className="mr-1 ml-1" role="presentation">
                <button
                  className="inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  id="open-tab"
                  data-tabs-target="#open"
                  type="button"
                  onClick={() => setTabOpen("Open")}
                  role="tab"
                  aria-controls="open"
                  aria-selected="false"
                >
                  Open
                </button>
              </li>
              <li className="mr-1 ml-1" role="presentation">
                <button
                  className="active inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  id="scheduled-tab"
                  data-tabs-target="#scheduled"
                  type="button"
                  onClick={() => setTabOpen("Scheduled")}
                  role="tab"
                  aria-controls="scheduled"
                  aria-selected="true"
                >
                  Scheduled
                </button>
              </li>
            </ul>
          </div>
          <div id="myTabContent">
            <div
              className="hidden rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              id="open"
              role="tabpanel"
              aria-labelledby="open-tab"
            >
              <div className="mt-4">
                <div className={`${showDetails ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-5'}`}>{displayOpens}</div>
              </div>
            </div>
            <div
              className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              id="scheduled"
              role="tabpanel"
              aria-labelledby="scheduled-tab"
            >
              <div className="mt-4">
              <div className={`${showDetails ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-5'}`}>{displayScheduled}</div>
              </div>
            </div>
          </div>
        </div>
        <div >
          {displayDetails() && (
            <Details
              details={showDetails![0]}
              onClick={() => setShowDetails(null)}
            ></Details>
          )}
        </div>
      </div>
      <script src="https://unpkg.com/@themesberg/flowbite@1.2.0/dist/flowbite.bundle.js"></script>
    </main>
  );
}