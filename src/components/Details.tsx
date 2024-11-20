"use client";
import React, { useState, useEffect } from "react";
import groupDetails from "~/types";
interface Props {
  onClick: () => void;
  details: groupDetails;
}
import { useUser } from "@clerk/nextjs";
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";

const Details = ({ onClick, details }: Props) => {
  const { user } = useUser();
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false);

  useEffect(() => {
    if (!details || !user) {
      joinedSetState(false);
      return;
    }
    const checkParticipantStatus = async () => {
      const groupDocRef = doc(db, "Study Groups", details.title ? details.title : "");
      const groupDoc = await getDoc(groupDocRef);
      const participants = groupDoc.data()?.participantDetails;
  
      if (participants && user) {
        const isParticipant = participants.some(
          (participant: any) => participant.email === user.emailAddresses[0]?.emailAddress
        );
        joinedSetState(isParticipant);
      } else {
        joinedSetState(false);
      }
    };
  
    checkParticipantStatus();
  }, [user, details]);


  const joinGroup = async () => {
    if (!joinedState) {
      const groupDocRef = doc(db, "Study Groups", details.title? details.title : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion({ name: user?.fullName, url: user?.imageUrl , email: user?.emailAddresses[0]?.emailAddress})
      });

      joinedSetState(!joinedState);
    } if (joinedState) {
      const groupDocRef = doc(db, "Study Groups", details.title? details.title : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayRemove({ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress})
      });
      joinedSetState(!joinedState);
    }
  };

  if(!details) return null;
  return (
    <div
      className="bg-white dark:bg-darkHighlight h-[80%] w-[30%] rounded-[10px] fixed right-[1rem] bottom-[2rem] p-[1rem] mr-[4rem]">
      <div className="flex justify-end">
        <button className="btn-close me-5 mt-3 text-[20px] mb-[-12px]" onClick={onClick}>X</button>
      </div>
      <div className="text-[35px] font-['Verdana']">
        {details.title}
      </div>
      <div className="card-body">
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Course</strong>: {details.course}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Location</strong>: {details.location}{" "}
        </p>
        <p
          className="card-text text-[20px] font-['Verdana']"
        >
          <strong>Participants</strong>: {details.participantDetails.length}{" "}/ {details.totalSeats}{" "}
          <button
            onClick={() => participantsSetState(!participantsState)}
            className="dropdown-button text-black text-[12px]"
          >
            {participantsState ? "▼" : "▲"}
          </button>
        </p>
        <div className="h-20 overflow-y-scroll p-[10px]">
        {participantsState &&
          details.participantDetails.map((participantDetail) => (
            <div className="flex items-center p-[5px]">
              <img
                className="w-[2rem] h-[2rem] rounded-full"
                src={participantDetail.url}
                alt="Example"
              />
              <p className="card-text text-[16px] font-['Verdana'] indent-[2rem]">
                {" "}
                <strong>Name</strong>: {participantDetail.name}
              </p>
              </div>
          ))}
          </div>
        <p className="text-[20px] font-['Verdana']">
          {" "}
          <strong>Details</strong>:
        </p>
        <div
          className="mb-3 h-[8rem] max-w-[20rem] bg-[#e0ded7] rounded-[10px] mx-auto mt-[10px]"
        >
          <div className="text-black p-[5px]">
            {details.details || "There are no details for this group."}
          </div>
        </div>
        <button
          className={`float-end me-3 mt-3  border-4 rounded-[26px] p-[10px] w-[100px] ${joinedState ? "border-blue-500 bg-[#226cf5]" : "border-black bg-[#f5f4f0]"}`}
          onClick={joinGroup}
        >
          {joinedState ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default Details;