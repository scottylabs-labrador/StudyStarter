"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsEditGroupModalOpen } from "~/lib/features/uiSlice";
import React, { useEffect, useState } from "react";
import { db } from "~/lib/api/firebaseConfig";
import {
  doc,
  getDocs,
  collection,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "~/lib/auth-client";
import { usePostHog } from 'posthog-js/react'
import groupDetails from "~/types";
import { GroupModalFrame } from "./GroupModalFrame";
import { GroupModalFields } from "./GroupModalFields";
import {
  updateEvent,
  setupGoogleApi,
  isCalendarApiReady,
  requestCalendarAccessInteractive,
  hasCalendarAccess,
} from "~/helpers/calendar_helper";

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
    const groupDocRef = doc(db, "StudyGroups", group.id);
    let calendarAuthPromise: Promise<void> | null = null;
    if (isCalendarApiReady() && !hasCalendarAccess()) {
      calendarAuthPromise = requestCalendarAccessInteractive().catch((err) => {
        console.warn("Calendar auth failed:", err);
      });
    }
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
    if (calendarAuthPromise) {
      await calendarAuthPromise;
    }
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const participant = group.participantDetails?.find(
      (p) => p.email === userEmail,
    );
    const eventId =
      (participant as any)?.eventId || (participant as any)?.event || "None";
    const start = firestoreTimestamp.toDate().toISOString();
    const end = new Date(firestoreTimestamp.toMillis() + 3600000).toISOString();
    await updateEvent(eventId, {
      summary: `Study Group: ${title}`,
      location,
      description: `Course: ${course}\nPurpose: ${purpose}\nDetails: ${details}`,
      start: { dateTime: start, timeZone: "America/New_York" },
      end: { dateTime: end, timeZone: "America/New_York" },
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
    if (!isOpen || !group) return;
    setTitle(group.title || "");
    setCourse(group.course || "");
    setPurpose(group.purpose || "");
    setDate(group.startTime?.toDate ? group.startTime.toDate() : null);
    setLocation(group.location || "");
    setSeats(group.totalSeats ? String(group.totalSeats) : "");
    setDetails(group.details || "");
  }, [isOpen, group]);

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
      id="editGroupPopUp"
      title="Edit Study Group"
      onClose={handleClose}
    >
        <form onSubmit={handleSubmit}>
          <GroupModalFields
            title={title}
            setTitle={setTitle}
            titleMaxLength={30}
            course={course}
            setCourse={setCourse}
            classes={classes}
            purpose={purpose}
            setPurpose={setPurpose}
            date={date}
            setDate={setDate}
            location={location}
            setLocation={setLocation}
            locationMaxLength={100}
            seats={seats}
            setSeats={setSeats}
            details={details}
            setDetails={setDetails}
          />
          <button
            type="submit"
            className="modal-submit-button"
          >
            Edit Group
          </button>
        </form>
    </GroupModalFrame>
  );
}
