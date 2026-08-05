"use client";

import { useEffect, useState } from "react";
import type { StudyGroup } from "~/types";
import { ApiRequestError } from "~/lib/api/client";
import { fetchGroup, subscribeToGroupChanges } from "../services/groupApi";

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
    let requestVersion = 0;

    const loadDetails = () => {
      const currentRequest = ++requestVersion;
      void fetchGroup(details.id)
        .then((group) => {
          if (cancelled || currentRequest !== requestVersion) return;
          setIsDeleted(false);
          setCurrentDetails(group);
          const participant = group.participantDetails.find(
            (participantDetail) => participantDetail.email === userEmail,
          );
          setIsJoined(Boolean(participant));
          setEventId(participant?.eventId ?? "None");
        })
        .catch((error: unknown) => {
          if (cancelled || currentRequest !== requestVersion) return;

          if (error instanceof ApiRequestError && error.status === 404) {
            setIsDeleted(true);
            setIsJoined(false);
            setEventId("None");
            return;
          }

          console.error("Error getting group details:", error);
        });
    };

    loadDetails();
    const unsubscribe = subscribeToGroupChanges(loadDetails);
    const refreshInterval = window.setInterval(loadDetails, 30_000);

    return () => {
      cancelled = true;
      unsubscribe();
      window.clearInterval(refreshInterval);
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
