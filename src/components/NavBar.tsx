"use client";

import { Fragment, useState } from "react";
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
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';


export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const isModalOpen = useAppSelector((state) => state.ui.isModalOpen);
  const isCreateGroupModalOpen = useAppSelector(
    (state) => state.ui.isCreateGroupModalOpen,
  );
  // var [theme, setTheme] = useState("light")
  var theme = "light";
  
  const handleCreateGroupClick = () => {
    dispatch(setIsCreateGroupModalOpen(true));
  };

  async function getThemeData() {
    try {
      const docRef = doc(db, "Users", userId? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        theme = docSnap.data().theme;
        if(theme === 'dark'){
          document.querySelector('html')?.classList.add('dark');
        }else{
          document.querySelector('html')?.classList.remove('dark');
        }
        const modeButton = document.getElementById("mode");
        if (modeButton) {
          modeButton.innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
        }
        return theme;
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  getThemeData();
  
  const updateTheme = async () => {
    // theme = document.getElementById("yearSelect").value;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const usersDocRef = doc(db, "Users", userId? userId : "");
      await setDoc(usersDocRef, { theme: theme }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  }

  const toggleTheme = () => {
    theme = (theme == "light") ? "dark" : "light";
    document.documentElement.classList.toggle("dark");
    if(theme === 'dark'){
      document.querySelector('html')?.classList.add('dark');
    }else{
      document.querySelector('html')?.classList.remove('dark');
    }
    const modeButton = document.getElementById("mode");
    if (modeButton) {
      modeButton.innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
    }
    updateTheme();
  };

  const getTheme = () => {
    if (theme == "dark") {
      return (
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg"
          id="mode"
        >
          Light Mode
        </button>
      );
    } else {
      return (
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg"
          id="mode"
        >
          Dark Mode
        </button>
      );
    }
  };

  return (
    <Fragment>
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden bg-lightSidebar dark:bg-darkSidebar px-4 pt-[50px] text-black dark:text-white">
        <div className="text-lg font-bold">CMU Meets</div>
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
          onClick={handleCreateGroupClick}
          className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton"
        >
          + Create
        </button>

        {getTheme()}

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
      <CreateGroupModal/>
    </Fragment>
  );
}
