"use client";
import "~/styles/globals.css";
import { useUser } from "@clerk/nextjs";
import { getUserPhotos } from "~/lib/api/getUserPhotos";
import { Photo } from "~/types";
import { useEffect, useState } from "react";
import { ClassList } from "~/components/ClassList";

function ProfileGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="aspect-h-1 aspect-w-1 w-full bg-[#DDD]">
          <img
            src={photo.url}
            alt="Uploaded"
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}

function ProfilePage() {
  const { user } = useUser();
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      if (user) {
        const userPhotos = await getUserPhotos(
          user.emailAddresses[0]?.emailAddress as string,
        );
        setPhotos(userPhotos);
      }
    };

    loadPhotos();
  }, [user]);

  const displayName =
    user?.fullName || user?.firstName || user?.username || "User";

  const gradYear = "202x";
  const aboutSection = "About section goes here";
  const majorsAndMinorsText = "Majors and minors go here";

  return (
    <div className="flex flex-col items-center p-4 font-sans">
      <div className="mb-4 flex flex-col items-center">
        <img
          src={user?.imageUrl || "https://via.placeholder.com/80"}
          alt="Profile"
          className="h-20 w-20 rounded-full"
        />
        <h1 className="mt-2 text-2xl font-bold text-white">{displayName}</h1>
        <p className="text-white">{user?.emailAddresses[0]?.emailAddress}</p>
        <div className="mt-4 text-white">
          <strong>Class of</strong> {gradYear}
        </div>
        <div className="mt-4 text-center text-white">
          <strong>About Me:</strong> {aboutSection}
        </div>
        <button className="mt-4 rounded-lg px-4 py-2 font-bold text-white bg-darkAccent">
          Edit Profile
        </button>
      </div>
      <div className="mt-4 flex w-full flex-col items-center">
        <h2 className="mb-2 text-2xl  text-white">
          Majors and Minors
        </h2>
        <div className="w-60 rounded-md border bg-darkHighlight p-2 text-center">
          {majorsAndMinorsText}
        </div>
      </div>
      <div className="mt-8 flex w-full justify-center">
        <ClassList />
      </div>
    </div>
  );
}

export default ProfilePage;
