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
      <div className="grid grid-rows-3 gap-y-6 overflow-hidden px-4 pt-[50px] text-white">
        <div className="text-lg font-bold">Study Group Finder</div>
        <a href="/feed" className={page == "feed" ? "font-bold" : ""}>
          Feed
        </a>
        <button
          onClick={handleCreateGroupClick}
          className="rounded-lg bg-white px-2 py-1 font-bold text-slate-800"
        >
          + Create
        </button>
        <a href="/profile" className={page == "profile" ? "font-bold" : ""}>
          Profile
        </a>
      </div>

      <SignOutButton>
        <button className="fixed bottom-4 left-4 rounded-lg bg-gray-200 px-4 py-2 font-bold text-black hover:bg-gray-300">
          Logout
        </button>
      </SignOutButton>

      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}
