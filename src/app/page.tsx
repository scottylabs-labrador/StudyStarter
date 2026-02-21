"use client";
import { useRouter } from "next/navigation";
import "~/styles/globals.css";
import { useUser, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { db } from '~/lib/api/firebaseConfig';
import { doc, collection, query, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import darkLogo from "~/image/darkLogoLarge.png";
import lightLogo from "~/image/lightLogoLarge.png";
import { Users, Calendar, MapPin, BookOpen, Search, PlusCircle } from 'lucide-react';

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("bad turkey");
      return;
    }
    setIsRedirecting(true);
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    const q = query(classesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      if (classes == undefined || classes == null || classes.length == 0) {
        router.push("/create_account");
      } else {
        router.push("/feed");
      }
    }, (error) => {
      console.error('Error getting documents: ', error);
    });

    return () => unsubscribe();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-lightbg dark:bg-darkbg">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
          {/* Hero Section */}
          <div className="max-w-4xl w-full text-center mb-16">
            <div className="mb-8 flex justify-center">
              <Image
                className="hidden dark:block"
                src={darkLogo}
                alt="CMU Study Logo"
                width={600}
                height={300}
                priority
              />
              <Image
                className="block dark:hidden"
                src={lightLogo}
                alt="CMU Study Logo"
                width={600}
                height={300}
                priority
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:text-white">
              Find Your Study Group
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-black dark:text-white">
              Connect with CMU students. Create, find, and join study groups for your classes.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <SignInButton mode="modal" forceRedirectUrl="/login">
                <button className="px-8 py-4 text-lg font-bold rounded-lg bg-lightButton dark:bg-darkButton text-black dark:text-white hover:bg-lightSelected dark:hover:bg-darkSelected transition-colors shadow-lg hover:shadow-xl">
                  Create Account
                </button>
              </SignInButton>
              <SignInButton mode="modal" forceRedirectUrl="/login">
                <button className="px-8 py-4 text-lg font-bold rounded-lg bg-lightButton dark:bg-darkButton text-black dark:text-white hover:bg-lightSelected dark:hover:bg-darkSelected transition-colors shadow-lg hover:shadow-xl">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <PlusCircle className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                Create Groups
              </h3>
              <p className="text-black dark:text-white text-center">
                Easily create study groups for your classes. Set the time, location, and purpose.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <Search className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                Find Groups
              </h3>
              <p className="text-black dark:text-white text-center">
                Search and filter study groups by course, or date to find the perfect match.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <Users className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                Join & Collaborate
              </h3>
              <p className="text-black dark:text-white text-center">
                Join study groups and collaborate with other CMU students to achieve your academic goals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <BookOpen className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                Manage Classes
              </h3>
              <p className="text-black dark:text-white text-center">
                Organize your study groups by class and track all your academic commitments in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <MapPin className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                CMU Locations
              </h3>
              <p className="text-black dark:text-white text-center">
                Meet at popular CMU locations like Gates, Wean, Doherty, or join virtual sessions on Zoom.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-lightSidebar dark:bg-darkSidebar rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-lightButton dark:bg-darkButton mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-black dark:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-black dark:text-white">
                Schedule Sessions
              </h3>
              <p className="text-black dark:text-white text-center">
                Plan your study sessions with clear dates and times. Never miss an important study group again.
              </p>
            </div>
          </div>

          {/* Privacy Policy Link */}
          <div className="mt-8 mb-4">
            <a 
              href="/privacy" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-black dark:text-white hover:text-lightSelected dark:hover:text-darkSelected transition-colors underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {isRedirecting && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-2xl font-bold mb-4 text-black dark:text-white">
                Welcome back!
              </div>
              <div className="text-black dark:text-white">
                Redirecting you...
              </div>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
}