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


interface CreateProfilePopUpProps {
  username: string;
  email: string;
}

const CreateProfilePopUp: React.FC<CreateProfilePopUpProps> = ({ username, email }) => {
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);
  
  const handleClose = () => {
      dispatch(setIsViewProfileOpen(false));
  };

  if (!isOpen) return null;

  async function getProfile() {
    const userId = email;
    try {
      const docRef = doc(db, "Users", userId? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const elem = document.getElementById("profileData")
        let year = data.year;
        year = year ? `<p class="font-bold">Class of `+year+`</p>` : ''
        let majors = data.majors;
        majors = majors ? `<p class=""><strong>Majors: </strong>`+majors+`</p>` : ''
        let minors = data.minors;
        minors = (minors && minors != '') ? `<p class=""><strong>Minors: </strong>`+minors+`</p>` : ''
        if (elem)
          elem.innerHTML = `
            <div>
              <h2 class="text-xl font-bold"><big>`+username+`</big></h2>
              <p class="text-l">`+email+`</p>
              `+year+`
              `+majors+`
              `+minors+`
            </div>
          `
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  }
  getProfile();

  return ( 
    // <div className="fixed inset-0 z-50 flex items-center justify-center y-50">
    <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="w-96 rounded-lg p-6 bg-lightSidebar dark:bg-darkSidebar">
            <div className="flex items-center justify-between">
                <div id="profileData" className="text-black dark:text-white"></div>
                <button onClick={handleClose} className="text-xl font-bold">
                  <big>&times;</big>
                 </button>
            </div>
        </div>
    </div>
  );
}

export default CreateProfilePopUp;