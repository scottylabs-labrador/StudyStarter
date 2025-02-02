"use client";
import "~/styles/globals.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useState } from "react";
import { ClassList } from "~/components/ClassList";
import { db } from '~/lib/api/firebaseConfig';
import { setDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';

function ContinueButton() {
  return (
    <a href="/feed" className="px-4 py-2 border-2 text-black hover:bg-darkAccent dark:hover:bg-darkAccent dark:hover:border-darkbg dark:text-white font-bold rounded-lg margintop-100 hover:bg-gray-300">
      Continue
    </a>
  )
}

export default function ProfilePage() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
  const displayName = user?.fullName || user?.firstName || user?.username || "User";
  const startYear = new Date().getFullYear();
  const years = [(startYear).toString(), (startYear+1).toString(), (startYear+2).toString(), (startYear+3).toString(), (startYear+4).toString(), (startYear+5).toString()];
  var year = "default";
  var majors = "";
  var minors = "";

  async function getYear() {
    try {
      const docRef = doc(db, "Users", userId? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        year = docSnap.data().year;
        document.getElementById("yearSelect").value = (year != undefined)? year : "default";
        return year;
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getMajors() {
    try {
      const docRef = doc(db, "Users", userId? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        majors = docSnap.data().majors;
        document.getElementById("majorInput").value = (majors != undefined)? majors : "";
        return majors;
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }    
  }

  async function getMinors() {
    try {
      const docRef = doc(db, "Users", userId? userId : "");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        minors = docSnap.data().minors;
        document.getElementById("minorInput").value = (minors != undefined)? minors : "";
        return minors;
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  year = getYear();
  majors = getMajors();
  minors = getMinors();

  const changeYear = async () => {
    year = document.getElementById("yearSelect").value;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const usersDocRef = doc(db, "Users", userId? userId : "");
      await setDoc(usersDocRef, { year: year }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  }

  const changeMajors = async () => {
    majors = document.getElementById("majorInput").value;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const usersDocRef = doc(db, "Users", userId? userId : "");
      await setDoc(usersDocRef, { majors: majors }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  }

  const changeMinors = async () => {
    minors = document.getElementById("minorInput").value;
    const userId = user?.emailAddresses[0]?.emailAddress;
    try {
      const usersDocRef = doc(db, "Users", userId? userId : "");
      await setDoc(usersDocRef, { minors: minors }, { merge: true });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-4 font-sans ">
      <div className="flex items-center mb-4">
        <img
          src={user?.imageUrl || "https://via.placeholder.com/80"}
          alt="Profile"
          className="w-20 h-20 rounded-full"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold dark:text-white">{displayName}</h1>
          <p className="dark:text-white">{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
      </div>
      <div>
        <select id="yearSelect" name="yearSelect" onChange={changeYear} className= "px-4 py-2 border-2 text-black bg-lightbg dark:bg-lightSidebar hover:bg-lightSidebar dark:bg-darkSidebar dark:hover:bg-darkAccent dark:hover:border-darkbg font-bold rounded-lg margintop-100 hover:bg-gray-300">
          <option disabled selected value={"default"}>Select Year</option>
          <option value={years[0]}>Class of {years[0]}</option>
          <option value={years[1]}>Class of {years[1]}</option>
          <option value={years[2]}>Class of {years[2]}</option>
          <option value={years[3]}>Class of {years[3]}</option>
          <option value={years[4]}>Class of {years[4]}</option>
          <option value={years[5]}>Class of {years[5]}</option>
        </select>
      </div>
      <br></br>
      <h1 className="text-xl font-bold mb-4 dark:text-white text-back">Add Your Majors and Minors Below</h1>
      <h1 className="text-l font-bold mb-4 dark:text-white text-back">Majors:</h1>
      <input
        id="majorInput"
        className="text-black border border-gray-300 bg-lightbg dark:bg-lightSidebar rounded p-2 w-full mb-0"
        type="text"
        onChange={changeMajors}
        placeholder="Add your majors here"
        required
      />
      <br></br>
      <br></br>
      <h1 className="text-l font-bold mb-4 dark:text-white text-back">Minors:</h1>
      <input
        id="minorInput"
        className="text-black border border-gray-300 bg-lightbg dark:bg-lightSidebar rounded p-2 w-full mb-0"
        type="text"
        onChange={changeMinors}
        placeholder="Add your minors or concentrations here or none if you don't have any"
      />  
      <ClassList />
      <br></br>
      <ContinueButton />
    </div>
  );
}
