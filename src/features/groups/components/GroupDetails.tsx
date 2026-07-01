"use client";
import React, { useState, useEffect, useRef } from "react";
import groupDetails from "~/types";
import { setIsEditGroupModalOpen, setIsViewProfileOpen } from "~/lib/features/uiSlice";
import { useUser } from "~/lib/auth-client";
import CreateProfilePopUp from "~/features/profile/components/CreateProfilePopUp";
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
import EditGroupModal from "./EditGroupModal";
import { addToCal, deleteFromCal, isCalendarApiReady, requestCalendarAccessInteractive, setupGoogleApi } from "~/helpers/calendar_helper";
interface Props {
  onClick: () => void;
  details: groupDetails;
  updateJoinedGroups: React.Dispatch<React.SetStateAction<string[] | null>>;
}
import { usePostHog } from 'posthog-js/react'
import { Pencil } from "lucide-react";
import { BlockedUsers } from "~/features/profile/components/BlockList";


const GroupDetails = ({ onClick, details, updateJoinedGroups }: Props) => {
  const { user } = useUser();
  const [participantsState, participantsSetState] = useState(true);
  const [joinedState, joinedSetState] = useState(false);
  const [eventIdState, setEventIdState] = useState<string>("None")
  const [currentDetails, setCurrentDetails] = useState(details);
  const [viewUser, setViewUser] = useState<string | null>(null);
  const [viewEmail, setViewEmail] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isViewProfileOpen);
  const isViewProfileOpen = useAppSelector(
    (state) => state.ui.isViewProfileOpen,
  );
  const posthog = usePostHog()

  const handleViewProfileClick = (event) => {
    setViewUser(event.currentTarget.getAttribute('data-username'));
    setViewEmail(event.currentTarget.getAttribute('data-email'));
    dispatch(setIsViewProfileOpen(true));
  };

  useEffect(() => {
    if (!details || !user) return;

    if (!details.id) {
      return;
    }
    const groupDocRef = doc(db, "StudyGroups", details.id);
    const unsubscribe = onSnapshot(groupDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as groupDetails;
        setCurrentDetails(data);
        const participants = docSnapshot.data()?.participantDetails;
        const isParticipant = participants.some(
          (participant: any) =>
            participant.email === user.emailAddresses[0]?.emailAddress,
        );
        let eventId = undefined;
        if (isParticipant) {
          eventId = participants.find(
            (participant: any) =>
              participant.email === user.emailAddresses[0]?.emailAddress,
          )?.eventId;
        }
        if (eventId == undefined) {
          eventId = "None"
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
useEffect(() => {
    setupGoogleApi().catch((err) => {
      console.warn("Failed to initialize Google API:", err);
    });
  }, []);

  /* Dynamic size for the info popup */
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | undefined>(undefined);
  useEffect(() => {
    const updateHeight = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const top = rect.top; // distance from top of viewport
      const available = window.innerHeight - top - 20; // 20px from bottom
      setMaxHeight(`${available}px`);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.addEventListener("scroll", updateHeight, { passive: true });

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("scroll", updateHeight);
    };
  });



  const joinGroup = async () => {
    let calendarAuthPromise: Promise<void> | null = null;
    if (isCalendarApiReady()) {
      calendarAuthPromise = requestCalendarAccessInteractive({ forceRefresh: true }).catch((err) => {
        console.warn("Calendar auth failed:", err);
      });
    }
    const userId = user?.emailAddresses[0]?.emailAddress;
    const usersDocRef = doc(db, "Users", userId ? userId : "");
    let eventId:string | undefined = undefined;
    if (!joinedState) {
      if (
        currentDetails.participantDetails.length >= currentDetails.totalSeats
      ) {
        toast.error("Group unavailable");
        return;
      }
      // check that no participants blocked
      const userDoc = await getDoc(usersDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        const blocked: BlockedUsers = data.blocked || {blockedByMe: [], blockedByThem: []};
        const combinedBlocked = blocked.blockedByMe.concat(blocked.blockedByThem)
        if (combinedBlocked.length > 0) {
          const hasBlockedUser = currentDetails.participantDetails.some((participant) =>
            combinedBlocked.includes(participant.email?.toLowerCase() || "")
          );
          if (hasBlockedUser) {
            toast.error("Group unavailable");
            return;
          }
        }
      }

      // check that group still exists
      if (!details.id) {
        return;
      }
      const groupDocRef = doc(db, "StudyGroups", details.id);
      const groupDocSnap = await getDoc(groupDocRef);
      if (!groupDocSnap.exists()) {
        toast.error("Group unavailable");
        return;
      }

      // add group to calendar
      if (calendarAuthPromise) {
        await calendarAuthPromise;
      }
      if (userId) {
        eventId = (await addToCal(currentDetails.title, currentDetails.course, currentDetails.purpose, currentDetails.startTime, currentDetails.location, currentDetails.details, userId)) ?? "None";
      } else {
        eventId = "None";
      }

      // update group with new participant
      const newParticipant = {
        name: user?.fullName || "User",
        url: user?.imageUrl ?? null,
        email: user?.emailAddresses[0]?.emailAddress ?? userId,
        eventId
      }
      await updateDoc(groupDocRef, {
        participantDetails: arrayUnion(newParticipant),
      });

      // update user with new group
      await setDoc(
        usersDocRef,
        {
          joinedGroups: arrayUnion(currentDetails.id),
        },
        { merge: true },
      );
      toast.success("Joined group");
      posthog.capture('group_joined', { group: currentDetails })
      
      joinedSetState(!joinedState);
      updateJoinedGroups((prev) => {
        if (!prev) return null;
        return prev.concat(currentDetails.id);
      });
    }
    if (joinedState) {
      if (!details.id) {
        return;
      }
      const groupDocRef = doc(db, "StudyGroups", details.id);
      const groupDocSnap = await getDoc(groupDocRef);

      if (!groupDocSnap.exists()) {
        toast.error("Group unavailable");
        return;
      }

      const groupData = groupDocSnap.data() as groupDetails;
      const userEmail = user?.emailAddresses[0]?.emailAddress ?? userId;
      const participant = groupData.participantDetails.find(
        (participantDetail) => participantDetail.email === userEmail,
      );
      const eventIdToDelete = participant?.eventId ?? eventIdState;
      const remainingParticipants = groupData.participantDetails.filter(
        (participantDetail) => participantDetail.email !== userEmail,
      );

      await updateDoc(groupDocRef, {
        participantDetails: remainingParticipants,
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

      if (calendarAuthPromise) {
        await calendarAuthPromise;
      }

      if (eventIdToDelete && eventIdToDelete != "None") {
        await deleteFromCal(eventIdToDelete);
      } else {
        toast("Could not delete from calendar", {
          icon: "❌",
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }

      const onlyMember = remainingParticipants.length === 0;
      if (onlyMember) {
        await deleteDoc(groupDocRef);
        onClick();
        posthog.capture('group_emptied', { group: currentDetails })
      }
    }
  };

  if (!currentDetails) return null;
  const [formattedDate, formattedTime] = formatDateTime(
    currentDetails.startTime,
  );
  return (
    <div ref={cardRef} style={{ maxHeight }} className="group-details-card">
      
      {/* Title */}
      <div className="group-details-header">
        <p className="group-details-title">{currentDetails.title}</p>
        {/* Edit Group */}
        {joinedState && currentDetails.participantDetails.length === 1 ? (
          <button
            className="group-details-action"
            onClick={() => dispatch(setIsEditGroupModalOpen(true))}
            aria-label="Edit group"
          >
            <Pencil size={20} />
          </button>
        ) : (
          <div></div>
        )}
        {/* Close Button */}
        <button className="group-details-action" onClick={onClick}>
          <big>&times;</big>
        </button>
        
      </div>

      <div id="group_info_popup_body" className="pb-20">
        {/* GroupDetails Body */}
        <p className="group-details-text">
          <strong>Course:</strong> {currentDetails.course}
        </p>
        <p className="group-details-text">
          <strong>Purpose</strong>: {currentDetails.purpose}
        </p>
        <p className="group-details-text">
          <strong>Time</strong>: {formattedTime}
        </p>
        <p className="group-details-text">
          <strong>Date</strong>: {formattedDate}
        </p>
        <p className="group-details-text">
          <strong>Location:</strong> {currentDetails.location}
        </p>
        <p className="group-details-text">
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
          <div className="participant-list">
            {currentDetails.participantDetails.map((participantDetail, index) => (
              <div key={index} className="participant-row">
                <button
                  onClick={handleViewProfileClick}
                  className="participant-row"
                  data-username={participantDetail.name}
                  data-email={participantDetail.email}
                  >
                  <img
                    className="participant-avatar"
                    src={participantDetail.url}
                  />
                  {/* <p className="indent-[1rem]"><strong className="indent-[2rem] font-['Verdana'] text-[16px]">
                    Name: 
                  </strong>{" "}
                  {" "+participantDetail.name}</p> */}
                  <p className="participant-name">
                    {participantDetail.name.split(" ")[0]}
                  </p>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Details Section */}
        <strong className="group-details-text">Details:</strong>
        <div className="group-details-freeform">
          {currentDetails.details ? currentDetails.details : "Hope you have a good time!"}
        </div>

        {viewUser && <CreateProfilePopUp username={viewUser} email={viewEmail}/>}
        </div>

      {/* Join Button */}
        <button id="card_info_join_btn"
          className={`join-button ${
            joinedState
              ? "join-button-active"
              : "join-button-inactive"
          }`}
          onClick={joinGroup}
        >
          {joinedState ? "Leave" : "Join"}
        </button>
      {viewUser && <CreateProfilePopUp username={viewUser} email={viewEmail}/>}
      <EditGroupModal group={currentDetails} />
    </div>
  );
};

export default GroupDetails;
