import { doc, Firestore, getDoc } from "firebase/firestore";
export async function returnUserGroups(db: Firestore, user: any): Promise<string[] | null> {
    if (user) {
        const userId = user?.emailAddresses[0]?.emailAddress;
        const userDocRef = doc(db, "Users", userId ? userId : "");
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          return null;
        }
        else {
          const joinedGroupsData = userDocSnap.data().joinedGroups || [];
            return joinedGroupsData;
        }
      } else {
        return(null);
      }
}
export async function checkParticipantStatus(db: Firestore, user: any, groupId: string): Promise<boolean> {
    const joinedGroupsData = await returnUserGroups(db, user);
    if (joinedGroupsData) {
        return joinedGroupsData.includes(groupId);
    }
    return false
  };