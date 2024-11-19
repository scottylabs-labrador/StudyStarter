"use client";
import Details from "~/components/Details";
import groupDetails from "~/types";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

export default function FeedPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const { user } = useUser();
  
  useEffect(() => {
    if (!user) return;
    const classesRef = collection(db, "Study Groups");
    const q = query(classesRef, where("isAvailable", "==", true));

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
    <div className="max-w-sm overflow-hidden rounded bg-white shadow-lg cursor-pointer px-6 py-4" onClick={() => setShowDetails(group)}>
        <div className="mb-2 text-xl font-bold">{group.title}</div>
        <ul>
          <li>{group.course}</li>
          <li>{group.time}</li>
          <li>{group.location}</li>
        </ul>
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
          {showDetails && <Details details={showDetails!} onClick={() => setShowDetails(null)}></Details>}
        </div>
      </div>
    </main>
  );
}