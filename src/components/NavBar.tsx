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

  return (
    <Fragment>
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden px-4 pt-[50px] dark:text-white">
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
        <a
          href="/profile"
          className="fixed top-4 right-6 flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-lg dark:bg-darkAccent"
        >
          P
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
