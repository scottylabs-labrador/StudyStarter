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
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if(document.documentElement.classList.contains('dark')){
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }else{
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
      
  }

  return (
    <Fragment>
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden px-4 pt-[50px] bg-lightSidebar dark:bg-darkSidebar dark:text-white">
        <div className="text-lg font-bold">Study Group Finder</div>
        <a href="/feed" className={page == "feed" ? "font-bold" : ""}>
          Feed
        </a>
        <button
          onClick={handleCreateGroupClick}
          className="rounded-lg bg-white px-2 py-1 font-bold dark:bg-darkAccent"
        >
          + Create
        </button>

        <button onClick={toggleTheme} className="rounded-lg bg-darkbg dark:bg-white text-white dark:text-darkbg">
          Dark mode
        </button>

        <a
          href="/profile"
          className="fixed top-4 right-6 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg bg-darkAccent"
          style={{ zIndex: 1000 }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
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
