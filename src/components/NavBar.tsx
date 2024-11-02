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
          My Groups
        </a>
      </div>
      <button
        onClick={handleCreateGroupClick}
        className="fixed bottom-4 left-4 rounded-lg bg-white px-4 py-2 font-bold text-slate-800"
      >
        + Create
      </button>
      < 
        a href = '/profile'
        className="fixed bottom-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-gray-500 text-white font-bold shadow-lg hover:bg-blue-600"
      >
        P
      </a>
      
      <UploadModal />
      <CreateGroupModal />
    </Fragment>
  );
}

