"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
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
import { useUser } from "~/lib/auth-client";
import { usePostHog } from 'posthog-js/react'
import { addToCal, setupGoogleApi, isCalendarApiReady, requestCalendarAccessInteractive } from "~/helpers/calendar_helper";
import { GroupModalFrame } from "./GroupModalFrame";
import { GroupModalFields } from "./GroupModalFields";

export default function CreateGroupModal() {
  const { user } = useUser();
  const userId = user?.emailAddresses[0]?.emailAddress;
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
  const isOpen = useAppSelector((state) => state.ui.isCreateGroupModalOpen);
  const posthog = usePostHog()

  const handleClose = () => {
    dispatch(setIsCreateGroupModalOpen(false));
  };

  async function checkId(docRef: DocumentReference): Promise<boolean> {
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    let calendarAuthPromise: Promise<void> | null = null;
    if (isCalendarApiReady()) {
      calendarAuthPromise = requestCalendarAccessInteractive({ forceRefresh: true }).catch((err) => {
        console.warn("Calendar auth failed:", err);
      });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 20; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    let timestamp: Date;

    if (!date) {
      toast.error("Invalid Date Input!");
      return;
    }

    let groupDocRef = doc(db, "StudyGroups", id);
    while (await checkId(groupDocRef)) {
      id = "";
      for (let i = 0; i < 20; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      groupDocRef = doc(db, "StudyGroups", id);
    }
    const firestoreTimestamp = Timestamp.fromDate(date);
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      toast("Error creating study group", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }
    if (calendarAuthPromise) {
      await calendarAuthPromise;
    }
    const eventId = (await addToCal(title, course, purpose, firestoreTimestamp, location, details, userEmail)) ?? "None";
    const participant = {
      name: user?.fullName || "User",
      url: user?.imageUrl ?? null,
      email: userEmail,
      eventId,
    };

    await setDoc(groupDocRef, {
      id,
      title,
      course,
      purpose,
      startTime: firestoreTimestamp,
      location,
      totalSeats: Number(seats),
      participantDetails: [participant],
      details,
    });
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
    await setDoc(
      usersDocRef,
      {
        joinedGroups: arrayUnion(id),
      },
      { merge: true },
    );

    setTitle("");
    setCourse("");
    setPurpose("");
    setDate(null);
    setTime("");
    setLocation("");
    setSeats("");
    setDetails("");
    handleClose();

    toast("Study group created successfully!", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    posthog.capture('group_created', { group: {
      id,
      title,
      course,
      purpose,
      startTime: firestoreTimestamp,
      location,
      totalSeats: Number(seats),
      participantDetails: [participant],
      details,
    }})
  };

  useEffect(() => {
    if (!user) return;
    const userId = user?.emailAddresses[0]?.emailAddress;
    if (!userId) {
      return;
    }
    const usersDocRef = doc(db, "Users", userId);
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
    if (!isOpen) return;
    let cancelled = false;
    setupGoogleApi()
      .then(() => {
        if (cancelled) return;
      })
      .catch((err) => {
        console.error("Failed to initialize Google API:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <GroupModalFrame
      id="createGroupPopUp"
      title="Create New Study Group"
      onClose={handleClose}
    >
        <form onSubmit={handleSubmit}>
          <GroupModalFields
            title={title}
            setTitle={setTitle}
            titleMaxLength={27}
            course={course}
            setCourse={setCourse}
            classes={classes}
            purpose={purpose}
            setPurpose={setPurpose}
            date={date}
            setDate={setDate}
            location={location}
            setLocation={setLocation}
            locationMaxLength={40}
            seats={seats}
            setSeats={setSeats}
            details={details}
            setDetails={setDetails}
          />
          <button
            type="submit"
            className="modal-submit-button"
          >
            Create Group
          </button>
        </form>
    </GroupModalFrame>
  );
}
