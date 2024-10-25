"use client";

import { Fragment, use } from "react";
import UploadModal from "./UploadModal";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "~/lib/features/uiSlice";
import { usePathname } from "next/navigation";
import { useAppSelector } from "~/lib/hooks";

export default function NavBar() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const page = pathname.split("/")[1];
    const isModalOpen = useAppSelector(state => state.ui.isModalOpen);
    return (
        <Fragment>
                <div className="grid grid-rows-3 gap-y-6 px-4 pt-[50px] overflow-hidden text-white">
                    <div className="font-bold text-lg">Study Group Finder</div>
                    <a href="/feed" className={page == "feed" ? "font-bold" : ""}>
                        Feed
                    </a>
                    <a href="/profile" className={page == "profile" ? "font-bold" : ""}>
                        Profile
                    </a>
                </div>
            <UploadModal/>
        </Fragment>
    );
    }

