"use client";
import darkLogo from "~/image/darkLogo2.png"
import lightLogo from "~/image/lightLogo2.png"
import { Fragment, useState, useEffect, useRef } from "react";
import CreateGroupModal from "~/features/groups/components/CreateGroupModal";
import { useDispatch } from "react-redux";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import { usePathname } from "next/navigation";
import { SignOutButton } from "~/lib/auth-client";
import { useUser } from "~/lib/auth-client";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';


export default function NavBar() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);
  
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
      <div className="sidebar-shell">
      <div className="sidebar-content">
        {/* Top Section */}
        <div>
          <div className="flex flex-row items-center w-full">
            <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="md:hidden mr-auto">
              {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {/* Hide content after first button on small screens */}
            <a href="/feed" className="hidden md:flex h-[50px] items-center">
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
            </a>
          </div>
        </div>

        {/* Middle Section (Navigation Buttons) - Hidden on small screens */}
        <div className="hidden md:flex flex-col gap-y-4">
          <a href="/feed" className={`nav-link ${page == "feed" ? "nav-link-active" : ""}`}>
            Group Finder
          </a>
          <a href="/my-groups" className={`nav-link ${page == "my-groups" ? "nav-link-active" : ""}`}>
            My Groups
          </a>
          {/* <button
            onClick={() => dispatch(setIsCreateGroupModalOpen(true))}
            className="w-full rounded-lg px-2 py-2 font-bold bg-lightButton dark:bg-darkButton"
          >
            + Create
          </button> */}
          <button
            onClick={toggleTheme}
            className="button-inverse w-full modeButton"
            id="mode"
          >
            Light Mode
          </button>
        </div>


        {/* Bottom Section (Feedback Button) - Hidden on small screens */}
        <div className="hidden md:block pb-4">
          <a href='https://forms.gle/MEQ7miCZCrC48P6y8' target="_blank" rel="noopener noreferrer" className="button-primary block w-full text-center">
              Feedback
          </a>
          <a 
            href="/privacy" 
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center pb-2 rounded-lg text-xs underline ${page == "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : " text-black dark:text-white"}`}
          >
            Privacy Policy
          </a>
        </div>
      </div>
      </div>

      {/* Drawer Menu */}
      {isDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
        <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
          <div>
            <button onClick={() => setIsDrawerOpen(false)} className="mb-4 text-black dark:text-white">
              <X size={24}/>
            </button>
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
            <nav className="flex flex-col gap-y-4">
              <a href="/feed" className={`py-2 ${page === "feed" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}>
                Group Finder
              </a>
              <a href="/my-groups" className={page === "my-groups" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}>
                My Groups
              </a>
              <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-lightbg text-lightbg dark:text-darkbg modeButton" id="mode">
                Dark Mode
              </button>
              <div
                ref={profileMenuRef}
                className="drawer-profile-menu-container"
              >
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="avatar-button"
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                >
                  <img
                    src={user?.imageUrl || "https://via.placeholder.com/80"}
                    alt="Profile"
                    className="rounded-full"
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="profile-menu">
                    <a
                      href="/profile"
                      className="profile-menu-item"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Profile
                    </a>
                    <SignOutButton>
                      <button
                        type="button"
                        className="profile-menu-item"
                      >
                        Logout
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            </nav>
          </div>
      
          {/* Feedback Button */}
          <div className="pb-4">
            <a href='https://forms.gle/MEQ7miCZCrC48P6y8' target="_blank" rel="noopener noreferrer" className="feedback-link">
              Feedback
            </a>
            <a 
              href="/privacy" 
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full text-center pb-2 rounded-lg text-xs underline ${page == "privacy" ? "font-bold text-lightSelected dark:text-darkSelected" : "text-black dark:text-white"}`}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      
      )}

      <CreateGroupModal />
    </Fragment>
  );
}
