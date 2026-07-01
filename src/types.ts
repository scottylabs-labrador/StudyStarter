import type { Timestamp } from "firebase/firestore";

export type StudyGroupParticipant = {
  name: string;
  url: string | null;
  email: string;
  eventId?: string;
  event?: string;
};

export interface StudyGroup {
  title: string;
  id: string;
  totalSeats: number;
  location: string;
  purpose: string;
  startTime: Timestamp;
  course: string;
  participantDetails: StudyGroupParticipant[];
  details: string;
}
