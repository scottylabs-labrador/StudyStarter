import { Timestamp } from "firebase/firestore";

export default interface groupDetails {
    title: string,
    id: string,
    totalSeats: number,
    location: string,
    purpose: string,
    startTime: Timestamp,
    course: string,
    participantDetails: {
        name: string,
        url: string,
        email: string,
        event: string
    }[],
    details: string
}
export interface Photo {
    id: string;
    url: string;
    timestamp: Date;
    userEmail: string;
}
