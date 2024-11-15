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


const myGroup: groupDetails[]=[];


const displayDetails = () => {
  // Ensure the study group selection for details card is the same as the currently open tab
  if (showDetails && showDetails[1] == tabOpen) {
    return showDetails;
  }
  return null;
};
 
  const [showDetails, setShowDetails] = useState<[groupDetails, "myGroup" | "Scheduled"] | null>(null); // index 1 for open or scheduled
  const [tabOpen, setTabOpen] = useState<"myGroup" | "Scheduled">("Scheduled");

  const displaymyGroup = myGroup.map((group) => (
    <div
      className="max-w-sm cursor-pointer overflow-hidden rounded dark:bg-darkSelected shadow-lg"
      onClick={() => setShowDetails([group, "myGroup"])}
    >
      <div className="px-6 py-4 ">
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
    <div className="max-w-sm overflow-hidden rounded dark:text-white bg-darkSidebar shadow-lg cursor-pointer" onClick={() => setShowDetails([group, "Scheduled"])}>
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
    <main className="container relative h-screen ">
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
                  className="inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium dark:text-white hover:border-darkHighlight hover:text-darkHighlight"
                  id="myGroup-tab"
                  data-tabs-target="#myGroup"
                  type="button"
                  onClick={() => setTabOpen("myGroup")}
                  role="tab"
                  aria-controls="myGroup"
                  aria-selected="false"
                >
                  My group
                </button>
              </li>
              <li className="mr-1 ml-1" role="presentation">
                <button
                  className="active inline-block rounded-t-lg border-b-2 border-transparent px-4 py-4 text-center text-sm font-medium dark:text-white hover:border-darkHighlight hover:text-darkHighlight"
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
              className="hidden rounded-lg text-white"
              id="myGroup"
              role="tabpanel"
              aria-labelledby="myGroup-tab"
            >
              <div className="mt-4">
                <div className={`${showDetails ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-5'}`}>{myGroup.length ==0 ? <p className="text-red"> Please join a group!</p> : displaymyGroup}</div>
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
