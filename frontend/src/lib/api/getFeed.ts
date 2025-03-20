"use server";
import { get } from "firebase/database";
import { photosRef, storageRef } from "./firebaseConfig";
import { query, limit, orderBy, getDocs, where, startAfter, doc, getDoc } from "firebase/firestore"; 
import { ref, getDownloadURL } from "firebase/storage";

/**
 * This is a server-side function.  It will not be included in the client bundle which is good because of the Firebase SDK.
 */

export async function getFeed(userEmail: string, start: string | null, num: number): Promise<[any[], string | undefined]> {
  const startDoc = start ? await getDoc(doc(photosRef, start)) : null;
  const photoQuery = startDoc ? query(photosRef,
      where("userId", "!=", userEmail), 
      orderBy("uploadTime", "desc"), 
      startAfter(startDoc),
      limit(num)
  ) : query(photosRef,
      where("userId", "!=", userEmail), 
      orderBy("uploadTime", "desc"), 
      limit(num)
  )
  const snapshots = await getDocs(photoQuery)
  const photos = snapshots.docs.map((doc) => {return {id: doc.id, ...doc.data()}});

  const photoData = photos.map(async (photoData: any) => {
      const photoRef = ref(storageRef, ('images/' + photoData.id));
      const url = await getDownloadURL(photoRef);
      return {
        id: photoData.id,
        url,
        timestamp: new Date(photoData.uploadTime.seconds * 1000),
        userEmail: photoData.userId
      };
    })
  return [await Promise.all(photoData), snapshots.docs[snapshots.docs.length - 1]?.id];
}
