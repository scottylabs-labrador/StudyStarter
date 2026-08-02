"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { fetchGroup } from "../services/groupApi";

export function useLiveGroupDetails(details: StudyGroup, userEmail?: string) {
  const [currentDetails, setCurrentDetails] = useState(details);
  const [isJoined, setIsJoined] = useState(false);
  const [eventId, setEventId] = useState("None");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setCurrentDetails(details);
  }, [details]);

  useEffect(() => {
    if (!details.id || !userEmail) return;

    let cancelled = false;

    void fetchGroup(details.id)
      .then((group) => {
        if (cancelled) return;
        setIsDeleted(false);
        setCurrentDetails(group);
        const participant = group.participantDetails.find(
          (participantDetail) => participantDetail.email === userEmail,
        );
        setIsJoined(Boolean(participant));
        setEventId(participant?.eventId ?? "None");
      })
      .catch(() => {
        if (cancelled) return;
        setIsDeleted(true);
        setIsJoined(false);
        setEventId("None");
      });

    return () => {
      cancelled = true;
    };
  }, [details.id, userEmail]);

  return {
    currentDetails,
    setCurrentDetails,
    isJoined,
    setIsJoined,
    eventId,
    isDeleted,
  };
}
