export default interface groupDetails {
    title: string
    totalSeats: number,
    location: string,
    time: string,
    course: string,
    participantDetails: {
        name: string,
        url: string
        email: string
    }[],
    details: string
}
export interface Photo {
    id: string;
    url: string;
    timestamp: Date;
    userEmail: string;
}