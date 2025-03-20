import {Timestamp} from "firebase-admin/firestore";

export interface groupDetails {
  title: string;
  id: string;
  totalSeats: number;
  location: string;
  purpose: string;
  startTime: Timestamp;
  course: string;
  participantDetails: {
    name: string;
    url: string;
    email: string;
  }[];
  details: string;
}

export interface userDetails {
  name: string;
  imageUrl: string;
  joinedGroups: string[];
  majors: string;
  year: string;
}
