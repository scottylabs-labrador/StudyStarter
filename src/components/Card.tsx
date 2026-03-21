"use client";
import React, { useState, useEffect, useRef } from "react";
import groupDetails from "~/types";
import { setIsEditGroupModalOpen, setIsViewProfileOpen } from "~/lib/features/uiSlice";
import { useUser } from "@clerk/nextjs";
import CreateProfilePopUp from "./CreateProfilePopUp";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  increment,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import toast from "react-hot-toast";
import { formatDateTime } from "~/helpers/date_helper";
import EditGroupModal from "./EditGroupModal";
import { addToCal, deleteFromCal, isCalendarApiReady, requestCalendarAccessInteractive, setupGoogleApi, hasCalendarAccess } from "~/helpers/calendar_helper";
interface Props {
  onClick: (g: groupDetails) => void;
  group: groupDetails;
  time: String | null;
  date: String | null;
  isInGroup: boolean;
  lightColor: string;
  darkColor: string;
}


const Card = ({ onClick, group, time,  date, isInGroup, lightColor, darkColor }: Props) => {
  return (
    <div
        className={`my-3 max-w-sm cursor-pointer overflow-hidden rounded-xl bg-${lightColor} dark:bg-${darkColor} px-6 py-4 shadow-lg text-black dark:text-white`}
        onClick={() => onClick(group)}
      >
        <div className="mb-2 text-xl font-bold truncate">{group.title}</div>
        <ul className="flex flex-row min-w-0">
          <li className="font-bold flex-shrink-0"> Course: &nbsp; </li>
          <li className="truncate flex-1">{group.course}</li>
        </ul>
        <ul className="flex flex-row min-w-0">
          <li className="font-bold flex-shrink-0"> Purpose: &nbsp; </li>
          <li className="truncate flex-1">{group.purpose}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold truncate"> Time: &nbsp; </li> <li>{time}</li>
        </ul>
        <ul style={{ display: "flex", flexDirection: "row" }}>
          <li className="font-bold truncate"> Date: &nbsp; </li> <li>{date}</li>
        </ul>
        <ul className="flex flex-row min-w-0">
          <li className="font-bold flex-shrink-0"> Location: &nbsp; </li>
          <li className="truncate flex-1">{group.location}</li>
        </ul>
        {isInGroup && <ul style={{ display: "flex", flexDirection: "row", justifyContent: "right"}}>
          <li className="bg-joined text-joinedText px-3 py-1 rounded-md -mt-8">Joined</li>
        </ul>}
      </div>
  );
};

export default Card;
