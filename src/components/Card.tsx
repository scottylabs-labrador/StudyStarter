"use client";
import React, { useState, useEffect } from "react";
import groupDetails from "~/types";
import {
  setIsProfileOpen,
  setIsViewProfileOpen,
} from "~/lib/features/uiSlice";
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
import { addToCal, deleteFromCal } from "~/helpers/calendar_helper";
interface Props {
  onClick: () => void;
  details: groupDetails;
  updateJoinedGroups: React.Dispatch<React.SetStateAction<string[] | null>>;
}
import { usePostHog } from 'posthog-js/react'

const Card = ({ onClick, details, updateJoinedGroups }: Props) => {
  const { user } = useUser();
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false);
  const [eventIdState, setEventIdState] = useState<string | undefined>(undefined)
  const [currentDetails, setCurrentDetails] = useState(details);
  const [viewUser, setViewUser] = useState<string | null>(null);
  const [viewEmail, setViewEmail] = useState<string | null>(null);

  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);
  const isViewProfileOpen = useAppSelector(
    (state) => state.ui.isViewProfileOpen,
  );
  const posthog = usePostHog()

  // var viewUser = null;

  const handleViewProfileClick = (event) => {
    setViewUser(event.currentTarget.getAttribute('data-username'));
    setViewEmail(event.currentTarget.getAttribute('data-email'));
    dispatch(setIsViewProfileOpen(true));
  };

  useEffect(() => {
    if (!details || !user) return;

    const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
    const unsubscribe = onSnapshot(groupDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as groupDetails;
        setCurrentDetails(data);
        const participants = docSnapshot.data()?.participantDetails;
        const isParticipant = participants.some(
          (participant: any) =>
            participant.email === user.emailAddresses[0]?.emailAddress,
        );
        let eventId = undefined
        if (isParticipant) {
          eventId = participants.find(
            (participant: any) =>
              participant.email === user.emailAddresses[0]?.emailAddress,
          )?.eventId;
        }
        joinedSetState(isParticipant);
        setEventIdState(eventId);
      }
    });

    return () => unsubscribe();
  }, [user, details]);
  useEffect(() => {
    setCurrentDetails(details);
  }, [details]);

  const joinGroup = async () => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    let eventId:string | undefined = undefined;
    if (!joinedState) {
      if (
        currentDetails.participantDetails.length >= currentDetails.totalSeats
      ) {
        toast.error("Group is full");
        return;
      }
      if (userId) {
        eventId = await addToCal(currentDetails.title, currentDetails.course, currentDetails.purpose, currentDetails.startTime, currentDetails.location, currentDetails.details, userId);
      } else {
        toast("Could not add to calendar", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }

      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");

      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion({
          name: user?.fullName,
          url: user?.imageUrl,
          email: user?.emailAddresses[0]?.emailAddress,
          eventId
        }),
      });
      await setDoc(
        usersDocRef,
        {
          joinedGroups: arrayUnion(currentDetails.id),
        },
        { merge: true },
      );
      toast.success("Joined group");
      joinedSetState(!joinedState);
      updateJoinedGroups((prev) => {
        if (!prev) return null;
        return prev.concat(currentDetails.id);
      });
      posthog.capture('group_joined', { group: currentDetails })
    }
    if (joinedState) {
      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayRemove({
          name: user?.fullName,
          url: user?.imageUrl,
          email: user?.emailAddresses[0]?.emailAddress,
          eventId: eventIdState,
        }),
      });
      await setDoc(
        usersDocRef,
        {
          joinedGroups: arrayRemove(currentDetails.id),
        },
        { merge: true },
      );
      toast.success("Left group");
      joinedSetState(!joinedState);
      updateJoinedGroups((prev) => {
        if (!prev) return null;
        return prev.filter((item) => item !== currentDetails.id);
      });
      posthog.capture('group_left', { group: currentDetails })

      const updatedGroupSnap = await getDoc(groupDocRef);
      if (updatedGroupSnap.exists()) {
        const updatedData = updatedGroupSnap.data();
        const onlyMember = !updatedData.participantDetails || updatedData.participantDetails.length === 0
        if (onlyMember) {
          await deleteDoc(groupDocRef);
          onClick();
          posthog.capture('group_emptied', { group: currentDetails })
        }
        if (eventIdState) {
          deleteFromCal(eventIdState);
        } else {
          toast("Could not add to calendar", {
            icon: "❌",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      }
    }
  };

  if (!currentDetails) return null;
  const [formattedDate, formattedTime] = formatDateTime(
    currentDetails.startTime,
  );
  return (
    <div className="overflow-y-scroll fixed md:bottom-[2rem] top-[5rem] md:right-[1rem] mr-[4rem] w-[93%] h-[85%] md:h-[85%] md:w-[30%] rounded-[10px] bg-lightAccent dark:bg-darkAccent text-black dark:text-white p-[1rem]">
      {/* Close Button */}
      <div className="flex justify-end">
        <button className="mb-[-12px] me-5 mt-3 text-xl font-bold" onClick={onClick}>
          <big>&times;</big>
        </button>
      </div>

      {/* Title */}
      <div className="font-['Verdana'] text-[35px]">{currentDetails.title}</div>

      {/* Card Body */}
      <p className="font-['Verdana'] text-[20px]">
        <strong>Course:</strong> {currentDetails.course}
      </p>
      <p className="card-text font-['Verdana'] text-[20px]">
        <strong>Purpose</strong>: {currentDetails.purpose}
      </p>
      <p className="card-text font-['Verdana'] text-[20px]">
        <strong>Time</strong>: {formattedTime}
      </p>
      <p className="card-text font-['Verdana'] text-[20px]">
        <strong>Date</strong>: {formattedDate}
      </p>
      <p className="font-['Verdana'] text-[20px]">
        <strong>Location:</strong> {currentDetails.location}
      </p>
      <p className="font-['Verdana'] text-[20px]">
        <strong>Participants:</strong>{" "}
        {currentDetails.participantDetails.length} / {currentDetails.totalSeats}{" "}
        <button
          onClick={() => participantsSetState(!participantsState)}
          className="text-[12px]"
        >
          {participantsState ? "▼" : "▲"}
        </button>
      </p>

      {/* Participant List */}
      {participantsState && (
        <div className="h-40 overflow-y-scroll p-[10px]">
          {currentDetails.participantDetails.map((participantDetail, index) => (
            <div key={index} className="flex items-center p-[5px]">
              <button
                onClick={handleViewProfileClick}
                className = "flex items-center p-[5px]"
                data-username={participantDetail.name}
                data-email={participantDetail.email}
                >
                <img
                  className="h-[2rem] w-[2rem] rounded-full"
                  src={participantDetail.url}
                />
                {/* <p className="indent-[1rem]"><strong className="indent-[2rem] font-['Verdana'] text-[16px]">
                  Name: 
                </strong>{" "}
                {" "+participantDetail.name}</p> */}
                <p className="indent-[0.5rem] font-['Verdana'] text-[16px]">
                  {participantDetail.name.split(" ")[0]}
                </p>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Details Section */}
      <strong className="font-['Verdana'] text-[20px]">Details:</strong>
      <div className="mx-auto mb-1 mt-[1px] h-[4rem] max-w-[25rem] rounded-[10px] p-[3px]">
        {currentDetails.details ? currentDetails.details : "Hope you have a good time!"}
      </div>

      {/* Join Button */}
      <button
        className={`float-end me-3 mt-3 w-[100px] rounded-[26px] p-[10px]  ${
          joinedState
            ? " bg-lightSelected dark:bg-darkSelected text-white"
            : "text-black dark:text-white border-2"
        }`}
        onClick={joinGroup}
      >
        {joinedState ? "Leave" : "Join"}
      </button>
      {viewUser && <CreateProfilePopUp username={viewUser} email={viewEmail}/>}
    </div>
  );
};

export default Card;
