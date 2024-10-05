"use client";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";


export default function ProfilePage() {
  const { user } = useUser();
  const groups = ["title1", "title2","title3"];
  return (
    <div className="p-4 font-sans">
      <div className="flex items-center mb-4">
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">{user?.emailAddresses[0]?.emailAddress}</h1>
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
      
    </div>
  );
}
