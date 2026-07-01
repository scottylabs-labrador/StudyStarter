"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsEditGroupModalOpen } from "~/lib/features/uiSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "~/lib/auth-client";
import { usePostHog } from 'posthog-js/react'
import groupDetails from "~/types";
import { GroupModalFrame } from "./GroupModalFrame";
import { GroupModalFields } from "./GroupModalFields";
import { useUserCourses } from "~/features/profile/hooks/useUserCourses";
import { updateStudyGroup } from "../services/groupService";
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
  const userId = user?.emailAddresses[0]?.emailAddress;
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState<Date | null>();
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState("");
  const [details, setDetails] = useState("");
  const { classes } = useUserCourses(userId);
  const classOptions = classes.map((course) => course.courseID);

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

    let calendarAuthPromise: Promise<void> | null = null;
    if (isCalendarApiReady() && !hasCalendarAccess()) {
      calendarAuthPromise = requestCalendarAccessInteractive().catch((err) => {
        console.warn("Calendar auth failed:", err);
      });
    }
    const updatedGroup = await updateStudyGroup({
      group,
      input: {
        title,
        course,
        purpose,
        date,
        location,
        seats,
        details,
      },
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
    const start = updatedGroup.startTime.toDate().toISOString();
    const end = new Date(updatedGroup.startTime.toMillis() + 3600000).toISOString();
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
      startTime: updatedGroup.startTime,
      location,
      totalSeats: Number(seats),
      participantDetails: group.participantDetails,
      details,
    }})
  };

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
            classes={classOptions}
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
