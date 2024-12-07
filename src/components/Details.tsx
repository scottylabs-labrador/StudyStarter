"use client";
import React, { useState, useEffect } from "react";
import groupDetails from "~/types";
import { useUser } from "@clerk/nextjs";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
  onSnapshot,
  increment,
  setDoc,
} from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import toast from "react-hot-toast";
import { formatDateTime } from "~/helpers/date_helper";
interface Props {
  onClick: () => void;
  details: groupDetails;
  updateJoinedGroups: React.Dispatch<React.SetStateAction<string[] | null>>;
}

const Details = ({ onClick, details, updateJoinedGroups }: Props) => {
  const { user } = useUser();
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false);
  const [currentDetails, setCurrentDetails] = useState(details);

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
        joinedSetState(isParticipant);
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
    if (!joinedState) {
      if (
        currentDetails.participantDetails.length >= currentDetails.totalSeats
      ) {
        toast.error("Group is full");
        return;
      }
      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion({
          name: user?.fullName,
          url: user?.imageUrl,
          email: user?.emailAddresses[0]?.emailAddress,
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
    }
    if (joinedState) {
      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayRemove({
          name: user?.fullName,
          url: user?.imageUrl,
          email: user?.emailAddresses[0]?.emailAddress,
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
    }
    // updateJoinedGroups(prev => !prev);
  };

  if (!currentDetails) return null;
  const [formattedDate, formattedTime] = formatDateTime(
    currentDetails.startTime,
  );
  return (
    <div className="fixed bottom-[2rem] right-[1rem] mr-[4rem] h-[85%] w-[30%] rounded-[10px] bg-white p-[1rem]">
      {/* Close Button */}
      <div className="flex justify-end">
        <button className="mb-[-12px] me-5 mt-3 text-[20px]" onClick={onClick}>
          X
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
        <div className="h-20 overflow-y-scroll p-[10px]">
          {currentDetails.participantDetails.map((participantDetail, index) => (
            <div key={index} className="flex items-center p-[5px]">
              <img
                className="h-[2rem] w-[2rem] rounded-full"
                src={participantDetail.url}
              />
              <strong className="indent-[2rem] font-['Verdana'] text-[16px]">
                Name:
              </strong>{" "}
              {participantDetail.name}
            </div>
          ))}
        </div>
      )}

      {/* Details Section */}
      <strong className="font-['Verdana'] text-[20px]">Details:</strong>
      <div className="mx-auto mb-3 mt-[10px] h-[8rem] max-w-[20rem] rounded-[10px] bg-[#e0ded7] p-[5px]">
        {currentDetails.details ? currentDetails.details : "Hope you have a good time!"}
      </div>

      {/* Join Button */}
      <button
        className={`float-end me-3 mt-3 w-[100px] rounded-[26px] border-4 p-[10px] ${
          joinedState
            ? "border-blue-500 bg-[#226cf5]"
            : "border-black bg-[#f5f4f0]"
        }`}
        onClick={joinGroup}
      >
        {joinedState ? "Joined" : "Join"}
      </button>
    </div>
  );
};

export default Details;
