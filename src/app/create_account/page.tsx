"use client";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getUserPhotos } from "~/lib/api/getUserPhotos";
import { Photo } from "~/types";
import { useEffect, useState } from "react";
import { ClassList } from "~/components/ClassList";

function ContinueButton() {
    return (
        <a href="/feed" className="px-4 py-2 border-2 hover:bg-darkAccent hover:border-darkbg text-white font-bold rounded-lg margintop-100 hover:bg-gray-300">
            Continue
        </a>
    )
}

export default function ProfilePage() {
  const { user } = useUser();
  const displayName = user?.fullName || user?.firstName || user?.username || "User";

  return (
    
    <div className="p-4 font-sans ">
      <div className="flex items-center mb-4">
        <img
          src={user?.imageUrl || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-white">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
        <div className="ml-auto">
          <SignOutButton>
            <button
              className="px-4 py-2 bg-gray-200 text-white font-bold rounded-lg bg-darkAccent"
            >
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>
      <h1 className="text-xl font-bold mb-4 text-white">Add Your Classes Below</h1>
      <ClassList />
      <br></br>
      <ContinueButton />
    </div>
  );
}
