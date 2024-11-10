export default interface groupDetails {
    title: string
    numberOfParticipants: number,
    totalSeats: number,
    location: string,
    time: string,
    course: string,
    participantDetails: {
        name: string,
        url: string
        
    }[],
    details: string
}
export interface Photo {
    id: string;
    url: string;
    timestamp: Date;
    userEmail: string;
}