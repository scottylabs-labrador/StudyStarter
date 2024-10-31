"use client";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getUserPhotos } from "~/lib/api/getUserPhotos";
import { Photo } from "~/types";
import { useEffect, useState } from "react";
import { ClassList } from "~/components/ClassList";

import { db } from '~/lib/api/firebaseConfig';

import { setDoc, doc, collection, query, onSnapshot } from 'firebase/firestore';
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";
// import HomePage from "../page";

function ProfileGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="w-full aspect-w-1 aspect-h-1 bg-[#DDD]">
          <img
            src={photo.url}
            alt="Uploaded"
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

function InClass() {
    const { user } = useUser();
    const [classes, setClasses] = useState<any[]>([]);
  
    useEffect(() => {
      if (!user) return;
      const userId = user?.emailAddresses[0]?.emailAddress;
      const usersDocRef = doc(db, "Users", userId? userId : "");
      const classesRef = collection(usersDocRef, "Classes");
      const q = query(classesRef);
  
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const classes = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setClasses(classes);
      }, (error) => {
        console.error('Error getting documents: ', error);
      });
  
      return () => unsubscribe();
    }, [user]);
    classes.map((cls) => (
      console.log(cls.id)
    ))
    console.log(classes);
    return classes.length > 0;
}

function ContinueButton() {
    return (
        <a href="/feed" className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg margintop-100 hover:bg-gray-300">
            Continue
        </a>
    )
}

export default function ProfilePage() {
  if (InClass()) { redirect("/feed");}
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      if (user) {
        const userPhotos = await getUserPhotos(user.emailAddresses[0]?.emailAddress as string);
        setPhotos(userPhotos);
      }
    };

    loadPhotos();
  }, [user]);

  const displayName = user?.fullName || user?.firstName || user?.username || "User";

  return (
    
    <div className="p-4 font-sans">
      <div className="flex items-center mb-4">
        <img
          src={user?.imageUrl || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
        <div className="ml-auto">
          <SignOutButton>
            <button
              className="px-4 py-2 bg-gray-200 text-black font-bold rounded-lg hover:bg-gray-300"
            >
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-4 text-white">Add Your Classes Below</h1>
      <div className="mt-8">
        <ProfileGrid photos={photos} />
      </div>
      <ClassList />
      <ContinueButton />
    </div>
  );
}
