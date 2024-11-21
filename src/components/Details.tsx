"use client";
import React, { useState, useEffect } from "react";
import groupDetails from "~/types";
interface Props {
  onClick: () => void;
  details: groupDetails;
}
import { useUser } from "@clerk/nextjs";
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc, onSnapshot, setDoc, query, collection } from "firebase/firestore";
import { db } from "~/lib/api/firebaseConfig";
import formatDateTime from "~/helpers/date_helper";

const Details = ({ onClick, details }: Props) => {
  const { user } = useUser();
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false)
  const [updatedDetails, setUpdatedDetails] = useState(details);
  useEffect(() => {
    if (!updatedDetails || !user) {
      joinedSetState(false);
      return;
    }
    const checkParticipantStatus = async () => {

      if (user) {
        const groupId = updatedDetails.id;
        const userId = user?.emailAddresses[0]?.emailAddress;
        const userDocRef = doc(db, "Users", userId ? userId : "");
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          joinedSetState(false);
        }
        else {
          const joinedGroupsData = userDocSnap.data().joinedGroups || [];
            joinedSetState(joinedGroupsData.includes(groupId))
        }
      } else {
        joinedSetState(false);
      }
    };

    checkParticipantStatus();
  }, [user, updatedDetails]);
  useEffect(() => {
    const updateDetails = async () => {
      const classRef = doc(db, "Study Groups", updatedDetails.id);
      const classDocSnap = await getDoc(classRef);
      if (classDocSnap.exists()) {
        setUpdatedDetails(classDocSnap.data() as groupDetails);
      }

    }
    if (!updatedDetails) {
      return;
    }
    updateDetails();
  }, [user, joinedState])
  useEffect(() => {
    setUpdatedDetails(details)
  }, [details])


  const joinGroup = async () => {
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    if (!joinedState) {
      const groupDocRef = doc(db, "Study Groups", updatedDetails.id ? updatedDetails.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion({ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress })
      });
      await setDoc(usersDocRef, {
        joinedGroups: arrayUnion(updatedDetails.id)
      }, { merge: true });

      joinedSetState(!joinedState);
    } if (joinedState) {
      const groupDocRef = doc(db, "Study Groups", updatedDetails.id ? updatedDetails.id : "");
      await updateDoc(groupDocRef, {
        participantDetails: arrayRemove({ name: user?.fullName, url: user?.imageUrl, email: user?.emailAddresses[0]?.emailAddress })
      });
      await setDoc(usersDocRef, {
        joinedGroups: arrayRemove(updatedDetails.id)
      }, { merge: true });
      joinedSetState(!joinedState);
    }
  };

  if (!updatedDetails) return null;
  const [formattedDate, formattedTime] = formatDateTime(details.startTime);
  return (
    <div
      className="bg-white dark:bg-darkHighlight h-[80%] w-[30%] rounded-[10px] fixed right-[1rem] bottom-[2rem] p-[1rem] mr-[4rem]">
      <div className="flex justify-end">
        <button className="btn-close me-5 mt-3 text-[20px] mb-[-12px]" onClick={onClick}>X</button>
      </div>
      <div className="text-[35px] font-['Verdana']">
        {updatedDetails.title}
      </div>
      <div className="card-body">
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Course</strong>: {updatedDetails.course}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Purpose</strong>: {updatedDetails.purpose}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Time</strong>: {formattedTime}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Date</strong>: {formattedDate}
        </p>
        <p className="card-text text-[20px] font-['Verdana']">
          <strong>Location</strong>: {updatedDetails.location}{" "}
        </p>
        <p
          className="card-text text-[20px] font-['Verdana']"
        >
          <strong>Participants</strong>: {updatedDetails.participantDetails.length}{" "}/ {updatedDetails.totalSeats}{" "}
          <button
            onClick={() => participantsSetState(!participantsState)}
            className="dropdown-button text-black text-[12px]"
          >
            {participantsState ? "▼" : "▲"}
          </button>
        </p>
        <div className="h-20 overflow-y-scroll p-[10px]">
          {participantsState &&
            updatedDetails.participantDetails.map((participantDetail) => (
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
            {updatedDetails.details || "There are no details for this group."}
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