"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsViewProfileOpen } from "~/lib/features/uiSlice";
import { useEffect, useState } from "react";
import { db, usersRef } from "~/lib/api/firebaseConfig";
import {
  setDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  DocumentReference,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

console.log("Blue Turkey!");

export default function CreateProfilePopUp(){
    const dispatch = useDispatch();
    const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);

    console.log("Purple Turkey!");
    
    const handleClose = () => {
        dispatch(setIsViewProfileOpen(false));
    };

    console.log("Green Turkey!");

    if (!isOpen) return null;

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-96 rounded-lg p-8 dark:bg-darkHighlight bg-lightSidebar">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Study Group</h2>
                <button onClick={handleClose} className="text-xl">
                &times;
                 </button>
            </div>
        </div>
    </div>
  );
}