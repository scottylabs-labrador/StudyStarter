"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { subscribeStudyGroup } from "../services/groupService";

export function useLiveGroupDetails(details: StudyGroup, userEmail?: string) {
  const [currentDetails, setCurrentDetails] = useState(details);
  const [isJoined, setIsJoined] = useState(false);
  const [eventId, setEventId] = useState("None");

  useEffect(() => {
    setCurrentDetails(details);
  }, [details]);

  useEffect(() => {
    if (!details.id || !userEmail) return;

    return subscribeStudyGroup(
      details.id,
      (group) => {
        setCurrentDetails(group);
        const participant = group.participantDetails.find(
          (participantDetail) => participantDetail.email === userEmail,
        );
        setIsJoined(Boolean(participant));
        setEventId(participant?.eventId ?? "None");
      },
      () => undefined,
    );
  }, [details.id, userEmail]);

  return {
    currentDetails,
    setCurrentDetails,
    isJoined,
    setIsJoined,
    eventId,
  };
}
