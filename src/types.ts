export default interface groupDetails {
    groupName: string
    numParticipants: number,
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
  