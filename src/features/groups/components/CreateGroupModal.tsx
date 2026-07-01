"use client";
import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "~/lib/auth-client";
import { usePostHog } from "posthog-js/react";
import {
  addToCal,
  setupGoogleApi,
  isCalendarApiReady,
  requestCalendarAccessInteractive,
} from "~/helpers/calendar_helper";
import { GroupModalFrame } from "./GroupModalFrame";
import { GroupModalFields } from "./GroupModalFields";
import { useUserCourses } from "~/features/profile/hooks/useUserCourses";
import { createStudyGroup } from "../services/groupService";

export default function CreateGroupModal() {
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
  const isOpen = useAppSelector((state) => state.ui.isCreateGroupModalOpen);
  const posthog = usePostHog();

  const handleClose = () => {
    dispatch(setIsCreateGroupModalOpen(false));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    let calendarAuthPromise: Promise<void> | null = null;
    if (isCalendarApiReady()) {
      calendarAuthPromise = requestCalendarAccessInteractive({
        forceRefresh: true,
      }).catch((err) => {
        console.warn("Calendar auth failed:", err);
      });
    }

    if (!date) {
      toast.error("Invalid Date Input!");
      return;
    }

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
    const eventId =
      (await addToCal(
        title,
        course,
        purpose,
        date,
        location,
        details,
        userEmail,
      )) ?? "None";
    const participant = {
      name: user?.fullName || "User",
      url: user?.imageUrl ?? null,
      email: userEmail,
      eventId,
    };

    const group = await createStudyGroup({
      input: {
        title,
        course,
        purpose,
        date,
        location,
        seats,
        details,
      },
      participant,
    });

    setTitle("");
    setCourse("");
    setPurpose("");
    setDate(null);
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
    posthog.capture("group_created", {
      group: {
        id: group.id,
        title,
        course,
        purpose,
        startTime: group.startTime,
        location,
        totalSeats: Number(seats),
        participantDetails: [participant],
        details,
      },
    });
  };

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
          classes={classOptions}
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
        <button type="submit" className="modal-submit-button">
          Create Group
        </button>
      </form>
    </GroupModalFrame>
  );
}
