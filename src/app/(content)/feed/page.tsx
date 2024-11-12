"use client";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";


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

const displayDetails = () => {
  // Ensure the study group selection for details card is the same as the currently open tab
  if (showDetails && showDetails[1] == tabOpen) {
    return showDetails;
  }
  return null;
};

  const [showDetails, setShowDetails] = useState<[groupDetails, "Open" | "Scheduled"] | null>(null); // index 1 for open or scheduled
  const [tabOpen, setTabOpen] = useState<"Open" | "Scheduled">("Scheduled");


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
    <main className="container relative h-screen">
      <div className={`${showDetails ? 'w-[60%]' : 'w-[100%]'}`}>
        <div className="mb-4 border-b dark:border-gray-700">
            <p className="inline-block rounded-t-lg border-b-2 px-4 py-4 text-sm text-white ">Scheduled</p>
        </div>
          <div className={`${showDetails ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-5'}`}>{displayScheduled}</div>
        <div>
          {displayDetails() && (
            <Details
              details={showDetails![0]}
              onClick={() => setShowDetails(null)}
            ></Details>
          )}
        </div>
      </div>
    </main>
  );
}
