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
import { useUser } from "@clerk/nextjs";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';
import { Menu, X } from 'lucide-react';


export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      <div className="flex flex-col items-center justify-between bg-lightSidebar dark:bg-darkSidebar px-4 py-3 text-black dark:text-white">
        <div className="flex flex-row items-center w-full">
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden mr-auto">
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1 text-center text-xl font-bold">CMU Study</div>
        </div>
        
        <div className=" hidden md:grid md:grid-rows-3 md:gap-y-6 md:px-4 md:pt-[50px]">
          <a href="/feed" className={page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}>
            Group Finder
          </a>
          <a href="/myGroup" className={page === "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}>
            My Groups
          </a>
          <button onClick={handleCreateGroupClick} className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton">
            + Create
          </button>
          <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg" id="mode">
            Dark Mode
          </button>
          <SignOutButton>
            <button className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDrawerOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-lightSidebar dark:bg-darkSidebar p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsDrawerOpen(false)} className="mb-4">
              <X size={24} />
            </button>
            <nav className="flex flex-col space-y-4">
              <a href="/feed" className={page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}>
                Group Finder
              </a>
              <a href="/myGroup" className={page === "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}>
                My Groups
              </a>
              <button onClick={handleCreateGroupClick} className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton">
                + Create
              </button>
              <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg" id="mode">
                Dark Mode
              </button>
              <SignOutButton>
                <button className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
                  Logout
                </button>
              </SignOutButton>
            </nav>
          </div>
        </div>
      )}

      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}
