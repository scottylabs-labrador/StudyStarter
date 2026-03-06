"use client";
import darkLogo from "~/image/darkLogo2.png"
import lightLogo from "~/image/lightLogo2.png"
import { Fragment, useState, useEffect } from "react";
import UploadModal from "./UploadModal";
import CreateGroupModal from "./CreateGroupModal";
import { useDispatch } from "react-redux";
import {
  setIsModalOpen,
  setIsCreateGroupModalOpen,
} from "~/lib/features/uiSlice";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useAppSelector } from "~/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';


export default function MobileNavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const displayName = user?.fullName || user?.firstName || user?.username || "User";
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  

  // var [theme, setTheme] = useState("light")
  // var theme = "light";
  
  const handleCreateGroupClick = () => {
    dispatch(setIsCreateGroupModalOpen(true));
  };

  const isModalOpen = useAppSelector((state) => state.ui.isModalOpen);
  const isCreateGroupModalOpen = useAppSelector(
    (state) => state.ui.isCreateGroupModalOpen
  );

  // Read theme from localStorage immediately to prevent flickering
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light"; // Default when rendering server-side
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      const modeButtons = document.getElementsByClassName("modeButton");
      if (modeButtons[0]) {
        modeButtons[0].innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
        if (modeButtons[1]) {
          modeButtons[1].innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
        }
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    async function fetchThemeFromDB() {
      if (!userId) return;

      try {
        const docRef = doc(db, "Users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const savedTheme = docSnap.data().theme;
          if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
          }
        }
      } catch (err) {
        console.error("Error fetching theme:", err);
      }
    }

    fetchThemeFromDB();
  }, [userId]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (userId) {
      try {
        const usersDocRef = doc(db, "Users", userId);
        await setDoc(usersDocRef, { theme: newTheme }, { merge: true });
      } catch (err) {
        console.error("Error saving theme to DB:", err);
      }
    }
  };
  

  return (
    <Fragment>
        <div className="md:hidden">
            <div className="bg-lightSidebar dark:bg-darkSidebar flex justify-between p-[1rem]">
                <div className="">
                    <a href="/feed">
                    <Image
                        className="hidden dark:block"
                        src={darkLogo}
                        alt="dark-mode-logo"
                        width={150}
                        height={75}
                    />
                    <Image
                        className="block dark:hidden"
                        src={lightLogo}
                        alt="light-mode-logo"
                        width={150}
                        height={75}
                    />
                    </a>
                </div>
                <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden ml-auto">
                    {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Drawer Menu - animated dropdown */}
            <div
                className={`grid transition-all duration-300 ease-out overflow-hidden ${
                    isDrawerOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="min-h-0">
                    <div className="bg-lightSidebar dark:bg-darkSidebar px-[1rem] pb-4">
                        <nav className="flex flex-col gap-y-4">
                            <a
                                href="/profile"
                                className="flex items-center font-bold text-black dark:text-white"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-full dark:bg-darkAccent bg-lightButton font-bold shrink-0">
                                    <img
                                        src={user?.imageUrl || "https://via.placeholder.com/80"}
                                        alt="Profile"
                                        className="rounded-full"
                                    />
                                </span>
                                <p className="ml-4">{displayName}</p>
                            </a>
                            <a href="/feed" className={`py-2 ${page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}>
                                Group Finder
                            </a>
                            <a href="/myGroup" className={`py-2 ${page === "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}>
                                My Groups
                            </a>
                            <div className="py-2 flex justify-between">
                                <button onClick={toggleTheme} className="p-2 rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg modeButton" id="mode">
                                    Dark Mode
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
  );
}
