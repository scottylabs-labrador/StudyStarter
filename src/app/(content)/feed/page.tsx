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
    details: "This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!This is for Greggo's Class, not Newstead's!",
  },
];

const open: groupDetails[]=[
  {
    title: "GRINDING SESSION",
    numParticipants: 1,
    totalSeats: 4,
    location: "Sorrels",
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
          <li>{group.time}</li>
          <li>{group.location}</li>
        </ul>
      </div>
    </div>
  ));

  const displayScheduled = groups.map((group) => (
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg cursor-pointer" onClick={() => setShowDetails([group, "Scheduled"])}>
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul>
          <li>{group.course}</li>
          <li>{group.time}</li>
          <li>{group.location}</li>
        </ul>
      </div>
    </div>
  ));

  return (
    <main className="container relative h-screen overflow-scroll">
      <div className="flex w-full">
        <div className="m-[2.5vw] w-[60vw]">
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="-mb-px flex flex-wrap"
              id="myTab"
              data-tabs-toggle="#myTabContent"
              role="tablist"
            >
              <li className="mr-2" role="presentation">
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
              <li className="mr-2" role="presentation">
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
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-4">{displayOpens}</div>
              </div>
            </div>
            <div
              className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              id="scheduled"
              role="tabpanel"
              aria-labelledby="scheduled-tab"
            >
              <div className="mt-8">
                <div className="grid grid-cols-2 gap-4">{displayScheduled}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[25vw]">
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
