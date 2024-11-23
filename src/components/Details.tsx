"use client";
import React, { useState, useEffect } from "react";
import groupDetails from "~/types";
import { useUser } from "@clerk/nextjs";
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc, onSnapshot, increment, setDoc } from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import toast from "react-hot-toast";
import formatDateTime from "~/helpers/date_helper";
interface Props {
  onClick: () => void;
  details: groupDetails;
}

const Details = ({ onClick, details }: Props) => {
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
          (participant: any) => participant.email === user.emailAddresses[0]?.emailAddress
        );
        joinedSetState(isParticipant);
      }
    });

    return () => unsubscribe();
  }, [user, details]);
  useEffect(() => {
    setCurrentDetails(details)
  }, [details]);

  const joinGroup = async () => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    if (!joinedState) {
      if (currentDetails.participantDetails.length >= currentDetails.totalSeats) {
        toast.error("Group is full");
        return;
      }
      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion({ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress })
      });
      await setDoc(usersDocRef, {
        joinedGroups: arrayUnion(currentDetails.id)
      }, {merge: true});
      toast.success("Joined group");
      joinedSetState(!joinedState);
    } if (joinedState) {
      const groupDocRef = doc(db, "Study Groups", details.id ? details.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayRemove({ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress })
      });
      await setDoc(usersDocRef, {
        joinedGroups: arrayRemove(currentDetails.id)
      }, {merge: true});
      toast.success("Left group");
      joinedSetState(!joinedState);
    }
  };

  if (!currentDetails) return null;
  const[formattedDate, formattedTime] = formatDateTime(currentDetails.startTime)
  return (
    <div className="bg-white h-[80%] w-[30%] rounded-[10px] fixed right-[1rem] bottom-[2rem] p-[1rem] mr-[4rem]">
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          className="me-5 mt-3 text-[20px] mb-[-12px]"
          onClick={onClick}
        >
          X
        </button>
      </div>

      {/* Title */}
      <div className="text-[35px] font-['Verdana']">{currentDetails.title}</div>

      {/* Card Body */}
      <p className="text-[20px] font-['Verdana']">
        <strong>Course:</strong> {currentDetails.course}
      </p>
      <p className="card-text text-[20px] font-['Verdana']">
          <strong>Purpose</strong>: {currentDetails.purpose}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Time</strong>: {formattedTime}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Date</strong>: {formattedDate}
        </p>
      <p className="text-[20px] font-['Verdana']">
        <strong>Location:</strong> {currentDetails.location}
      </p>
      <p className="text-[20px] font-['Verdana']">
        <strong>Participants:</strong> {currentDetails.participantDetails.length} / {currentDetails.totalSeats}{" "}
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
                className="w-[2rem] h-[2rem] rounded-full"
                src={participantDetail.url}
              />
              <strong className="text-[16px] font-['Verdana'] indent-[2rem]">Name:</strong> {participantDetail.name}
            </div>
          ))}
        </div>
      )}

      {/* Details Section */}
      <strong className="text-[20px] font-['Verdana']">Details:</strong>
      <div className="mb-3 h-[8rem] max-w-[20rem] bg-[#e0ded7] rounded-[10px] mx-auto mt-[10px] p-[5px]">{currentDetails.details}</div>

      {/* Join Button */}
      <button
        className={`float-end me-3 mt-3 border-4 rounded-[26px] p-[10px] w-[100px] ${
          joinedState ? "border-blue-500 bg-[#226cf5]" : "border-black bg-[#f5f4f0]"}`}
        onClick={joinGroup}
      >
        {joinedState ? "Joined" : "Join"}
      </button>
    </div>
  );
};

export default Details;