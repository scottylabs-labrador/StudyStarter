import { storageRef, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
import { ref, getDownloadURL } from "firebase/storage";
import { Photo } from "~/types";

export async function getUserPhotos(userId: string): Promise<Photo[]> {
    const userDocRef = doc(db, "Users", userId);
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const photoIds = userData?.Posts || []; 
  
      const fetchedPhotos: Photo[] = await Promise.all(
        photoIds.map(async (photoId: string) => {
          const photoRef = ref(storageRef, ('images/' + photoId));
          const url = await getDownloadURL(photoRef);
          return {
            id: photoId,
            url,
          };
        })
      );
  
      return fetchedPhotos;
    }
  
    return [];
}