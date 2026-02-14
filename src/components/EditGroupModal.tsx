"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsEditGroupModalOpen } from "~/lib/features/uiSlice";
import React, { useEffect, useState, forwardRef } from "react";
import { db } from "~/lib/api/firebaseConfig";
import {
  doc,
  getDocs,
  collection,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { usePostHog } from 'posthog-js/react'
import groupDetails from "~/types";

interface EditGroupModalProps {
  group: groupDetails | null;
}

export default function EditGroupModal({ group }: EditGroupModalProps) {
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState<Date | null>();
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState("");
  const [details, setDetails] = useState("");
  const [classes, setClasses] = useState<string[]>([]); // Define classes state

  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isEditGroupModalOpen);
  const posthog = usePostHog()

  const handleClose = () => {
    dispatch(setIsEditGroupModalOpen(false));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!group) return;
    if (!date) {
      toast.error("Invalid Date Input!");
      return;
    }

    const firestoreTimestamp = Timestamp.fromDate(date);
    const groupDocRef = doc(db, "Study Groups", group.id);
    await updateDoc(groupDocRef, {
      title,
      course,
      purpose,
      startTime: firestoreTimestamp,
      location,
      totalSeats: Number(seats),
      participantDetails: group.participantDetails,
      details,
    });

    setTitle("");
    setCourse("");
    setPurpose("");
    setDate(null);
    setTime("");
    setLocation("");
    setSeats("");
    setDetails("");
    handleClose();

    toast("Study group edited successfully!", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    posthog.capture('group_edited', { group: {
      id: group.id,
      title,
      course,
      purpose,
      startTime: firestoreTimestamp,
      location,
      totalSeats: Number(seats),
      participantDetails: group.participantDetails,
      details,
    }})
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    const classesRef = collection(usersDocRef, "Classes");
    getDocs(classesRef).then((querySnapshot) => {
      const classList: string[] = [];
      querySnapshot.forEach((doc) => {
        classList.push(doc.id);
      });
      setClasses(classList);
    });
  }, [user]);

  useEffect(() => {
    if (!isOpen || !group) return;
    setTitle(group.title || "");
    setCourse(group.course || "");
    setPurpose(group.purpose || "");
    setDate(group.startTime?.toDate ? group.startTime.toDate() : null);
    setLocation(group.location || "");
    setSeats(group.totalSeats ? String(group.totalSeats) : "");
    setDetails(group.details || "");
  }, [isOpen, group]);

  if (!isOpen) return null;

  const CustomDateInput = forwardRef(
    ({ value, onClick, placeholder, className, ...rest }, ref) => (
      <input
        onClick={onClick}
        ref={ref}
        value={value}
        readOnly
        placeholder={placeholder}
        // Merge the existing className with your own
        className={`w-full block mb-2 rounded border p-2 bg-lightInput dark:bg-darkInput text-black ${className || ''}`}
        {...rest}
      />
    )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" id="editGroupPopUp">
      <div className="w-96 rounded-lg p-8 bg-lightAccent dark:bg-darkAccent">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">Edit Study Group</h2>
          <button onClick={handleClose} className="text-xl font-bold text-black dark:text-white">
            <big>&times;</big>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="mb-2 w-full rounded border-b-4 border-b-lightbg dark:border-b-darkbg p-2 bg-lightInput dark:bg-darkInput text-black"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={30} // Reasonable character limit
          />
          <select
            className="mb-2 w-full rounded border p-2 bg-lightInput dark:bg-darkInput text-black"
            id="classSelect"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a class
            </option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <input
            className="mb-2 w-full rounded border p-2 bg-lightInput dark:bg-darkInput text-black"
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
            maxLength={50} // Reasonable character limit
          />
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Date/Time"
            popperClassName="custom-popper"
            calendarClassName="bg-lightInput dark:bg-darkInput"
            customInput={<CustomDateInput />}
            wrapperClassName="w-full"
            className="w-full"
            required
          />
          <input
            className="mb-2 w-full rounded border p-2 bg-lightInput dark:bg-darkInput text-black"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={100} // Reasonable character limit
            required
          />
          <input
            className="mb-2 w-full rounded border p-2 bg-lightInput dark:bg-darkInput text-black"
            type="number"
            placeholder="Max Seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            min="2" // Minimum participants of 2
            max="100"
          />
          <input
            className="mb-2 w-full rounded border p-2 bg-lightInput dark:bg-darkInput text-black"
            type="text"
            placeholder="Details"
            value={details}
            maxLength={200} // Reasonable character limit
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 w-full rounded bg-lightbg dark:bg-darkbg hover:bg-lightSelected dark:hover:bg-darkSelected px-4 py-2 font-bold text-black dark:text-white"
          >
            Edit Group
          </button>
        </form>
      </div>
    </div>
  );
}
