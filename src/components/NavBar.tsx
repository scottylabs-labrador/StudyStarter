"use client";

import { Fragment } from "react";
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

export default function NavBar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const page = pathname.split("/")[1];
  const isModalOpen = useAppSelector((state) => state.ui.isModalOpen);
  const isCreateGroupModalOpen = useAppSelector(
    (state) => state.ui.isCreateGroupModalOpen,
  );
  const handleCreateGroupClick = () => {
    dispatch(setIsCreateGroupModalOpen(true));
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.getElementById("mode")!.innerHTML = "Dark Mode";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.getElementById("mode")!.innerHTML = "Light Mode";
    }
  };

  const getTheme = () => {
    const themey = localStorage.getItem("theme");
    if (themey === "dark") {
      return (
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-darkbg text-white dark:bg-white dark:text-darkbg"
          id="mode"
        >
          Light Mode
        </button>
      );
    } else {
      return (
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-darkbg text-white dark:bg-white dark:text-darkbg"
          id="mode"
        >
          Dark Mode
        </button>
      );
    }
  };

  return (
    <Fragment>
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden bg-lightSidebar px-4 pt-[50px] dark:bg-darkSidebar dark:text-white">
        <div className="text-lg font-bold">CMU Meets</div>
        <a
          href="/feed"
          className={page == "feed" ? "font-bold dark:text-darkAccent" : ""}
        >
          Feed
        </a>
        <a
          href="/myGroup"
          className={page == "myGroup" ? "font-bold dark:text-darkAccent" : ""}
        >
          My Group
        </a>
        <button
          onClick={handleCreateGroupClick}
          className="rounded-lg bg-white px-2 py-1 font-bold dark:bg-darkAccent"
        >
          + Create
        </button>

        {/* <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-white text-white dark:text-darkbg" id="mode">
          
        </button> */}
        {getTheme()}

        <a
          href="/profile"
          className="fixed right-6 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-darkAccent font-bold shadow-lg"
          style={{ zIndex: 1000 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v1.5h16v-1.5c0-2.66-5.33-4-8-4z" />
          </svg>
        </a>

        <SignOutButton>
          <button className="fixed bottom-4 left-4 rounded-lg px-4 py-2 font-bold dark:bg-darkAccent dark:text-white">
            Logout
          </button>
        </SignOutButton>
      </div>

      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}
