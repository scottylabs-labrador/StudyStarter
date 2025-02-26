"use client";
import darkLogo from "~/image/darkLogo.png"
import lightLogo from "~/image/lightLogo.png"
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


export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // var [theme, setTheme] = useState("light")
  // var theme = "light";
  
  const handleCreateGroupClick = () => {
    dispatch(setIsCreateGroupModalOpen(true));
  };

  // async function getThemeData() {
  //   try {
  //     const docRef = doc(db, "Users", userId? userId : "");
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       theme = docSnap.data().theme;
  //       if(theme === 'dark'){
  //         document.querySelector('html')?.classList.add('dark');
  //       }else{
  //         document.querySelector('html')?.classList.remove('dark');
  //       }
  //       const modeButton = document.getElementById("mode");
  //       if (modeButton) {
  //         modeButton.innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
  //       }
  //       return theme;
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // getThemeData();
  
  // const updateTheme = async () => {
  //   // theme = document.getElementById("yearSelect").value;
  //   const userId = user?.emailAddresses[0]?.emailAddress;
  //   try {
  //     const usersDocRef = doc(db, "Users", userId? userId : "");
  //     await setDoc(usersDocRef, { theme: theme }, { merge: true });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  // const toggleTheme = () => {
  //   theme = (theme == "light") ? "dark" : "light";
  //   document.documentElement.classList.toggle("dark");
  //   if(theme === 'dark'){
  //     document.querySelector('html')?.classList.add('dark');
  //   }else{
  //     document.querySelector('html')?.classList.remove('dark');
  //   }
  //   const modeButton = document.getElementById("mode");
  //   if (modeButton) {
  //     modeButton.innerHTML = (theme == "light") ? "Dark Mode" : "Light Mode";
  //   }
  //   updateTheme();
  // };

  // const getTheme = () => {
  //   if (theme == "dark") {
  //     return (
  //       <button
  //         onClick={toggleTheme}
  //         className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg"
  //         id="mode"
  //       >
  //         Light Mode
  //       </button>
  //     );
  //   } else {
  //     return (
  //       <button
  //         onClick={toggleTheme}
  //         className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg"
  //         id="mode"
  //       >
  //         Dark Mode
  //       </button>
  //     );
  //   }
  // }

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
      <div className="flex flex-row items-center w-full">
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden mr-auto">
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="pt-10">
          <Image
            className="hidden dark:block"
            src={darkLogo}
            alt="dark-mode-logo"
            width={400}
            height={200}
          />
          <Image
            className="mb-4 block dark:hidden"
            src={lightLogo}
            alt="light-mode-logo"
            width={400}
            height={200}
          />
          </div>
        </div>
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
          className="fixed right-6 top-4 flex h-10 w-10 items-center justify-center rounded-full dark:bg-darkAccent bg-lightButton font-bold shadow-lg"
          style={{ zIndex: 1000 }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
              <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v1.5h16v-1.5c0-2.66-5.33-4-8-4z" />
            </svg>
        </a>
        <SignOutButton>
          <button className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
            Logout
          </button>
        </SignOutButton>
      </div>
      {/* </div> */}

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDrawerOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-lightSidebar dark:bg-darkSidebar p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsDrawerOpen(false)} className="mb-4">
              <X size={24} />
            </button>
            <div>
          <Image
            className="hidden dark:block"
            src={darkLogo}
            alt="dark-mode-logo"
            width={400}
            height={200}
          />
          <Image
            className="mb-4 block dark:hidden"
            src={lightLogo}
            alt="light-mode-logo"
            width={400}
            height={200}
          />
          </div>
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
              <a
              href="/profile"
              className="fixed right-6 top-4 flex h-10 w-10 items-center justify-center rounded-full dark:bg-darkAccent bg-lightButton font-bold shadow-lg"
              style={{ zIndex: 1000 }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                  <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v1.5h16v-1.5c0-2.66-5.33-4-8-4z" />
                </svg>
              </a>
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
