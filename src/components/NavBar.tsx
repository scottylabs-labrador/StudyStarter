"use client";

import { Fragment, useEffect, useState } from "react";
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
import { db } from "~/lib/api/firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";

export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
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
      const modeButton = document.getElementById("mode");
      if (modeButton) {
        modeButton.innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
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
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden bg-lightSidebar dark:bg-darkSidebar px-4 pt-[50px] text-black dark:text-white">
        <div className="text-xl font-bold">CMU Study</div>
        <a
          href="/feed"
          className={page == "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}
        >
          Group Finder
        </a>
        <a
          href="/myGroup"
          className={page == "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}
        >
          My Groups
        </a>
        <button
          onClick={() => dispatch(setIsCreateGroupModalOpen(true))}
          className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton"
        >
          + Create
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg"
          id="mode"
        >
          Light Mode
        </button>

        <a
          href="/profile"
          className="fixed right-6 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-lightButton dark:bg-darkButton font-bold shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
            <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v1.5h16v-1.5c0-2.66-5.33-4-8-4z" />
          </svg>
        </a>

        <SignOutButton>
          <button className="fixed bottom-4 left-4 rounded-lg px-4 py-2 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
            Logout
          </button>
        </SignOutButton>
      </div>

      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}
