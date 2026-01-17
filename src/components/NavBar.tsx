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
      <div className="grid grid-rows-[auto,1fr,auto] h-screen gap-y-6 overflow-hidden bg-lightbg dark:bg-darkbg md:bg-lightSidebar md:dark:bg-darkSidebar px-4 pt-[50px] text-black dark:text-white">
        {/* Top Section */}
        <div>
          <div className="flex flex-row items-center w-full">
            <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden mr-auto">
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Hide content after first button on small screens */}
            <div className="hidden md:flex h-[50px] items-center">
              <Image
                className="hidden dark:block"
                src={darkLogo}
                alt="dark-mode-logo"
                width={400}
                height={200}
              />
              <Image
                className="block dark:hidden"
                src={lightLogo}
                alt="light-mode-logo"
                width={400}
                height={200}
              />
            </div>
          </div>
        </div>

        {/* Middle Section (Navigation Buttons) - Hidden on small screens */}
        <div className="hidden md:flex flex-col gap-y-4">
          <a href="/feed" className={`w-full text-center py-2 rounded-lg ${page == "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}`}>
            Group Finder
          </a>
          <a href="/myGroup" className={`w-full text-center py-2 rounded-lg ${page == "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : ""}`}>
            My Groups
          </a>
          <button
            onClick={() => dispatch(setIsCreateGroupModalOpen(true))}
            className="w-full rounded-lg px-2 py-2 font-bold bg-lightButton dark:bg-darkButton"
          >
            + Create
          </button>
          <button
            onClick={toggleTheme}
            className="w-full rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg py-2 modeButton"
            id="mode"
          >
            Light Mode
          </button>
        </div>


        {/* Bottom Section (Feedback Button) - Hidden on small screens */}
        <div className="hidden md:block pb-4">
            <button className="w-full rounded-lg px-2 py-2 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
              <a href='https://forms.gle/MEQ7miCZCrC48P6y8'>
                Feedback
              </a>
            </button>
        </div>
      </div>

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsDrawerOpen(false)}>
        <div className="fixed left-0 top-0 h-full w-44 bg-lightSidebar dark:bg-darkSidebar p-4 shadow-lg flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
          <div>
            <button onClick={() => setIsDrawerOpen(false)} className="mb-4 text-black dark:text-white">
              <X size={24}/>
            </button>
            <div>
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
            </div>
            <nav className="flex flex-col gap-y-4">
              <a href="/feed" className={`py-2 ${page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}>
                Group Finder
              </a>
              <a href="/myGroup" className={page === "myGroup" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}>
                My Groups
              </a>
              <button onClick={handleCreateGroupClick} className="rounded-lg px-2 py-1 font-bold bg-lightButton dark:bg-darkButton text-black dark:text-white">
                + Create
              </button>
              <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg modeButton" id="mode">
                Dark Mode
              </button>
              <a
                href="/profile"
                className="fixed right-6 top-4 flex h-10 w-10 items-center justify-center rounded-full dark:bg-darkAccent bg-lightButton font-bold shadow-lg"
                style={{ zIndex: 1000 }}
              >
                <img
                  src={user?.imageUrl || "https://via.placeholder.com/80"}
                  alt="Profile"
                  className=" rounded-full"
                />
              </a>
            </nav>
          </div>
      
          {/* Feedback Button */}
          <div className="pb-4">
            <a href='https://forms.gle/MEQ7miCZCrC48P6y8'>
                Feedback
              </a>
          </div>
        </div>
      </div>
      
      )}

      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}
