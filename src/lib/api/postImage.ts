"use server";
import { storageRef, photosRef, usersRef } from "./firebaseConfig";
import { doc, setDoc, arrayUnion } from "firebase/firestore"; 
import { ref, uploadBytes } from "firebase/storage";
/**
 * This is a server-side function.  It will not be included in the client bundle which is good because of the Firebase SDK.
 */

export async function postImage(data: FormData, userId: string | undefined) {
    const file = data.get("uploadedImage") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const photo_uuid = crypto.randomUUID();

    uploadBytes(ref(storageRef, ('images/' + String(photo_uuid))), buffer)
    setDoc(doc(photosRef, photo_uuid), {
        "reference": `/studygroupfinder-14500.com/images/${photo_uuid}`,
        "uploadTime": new Date(),
        "userId": userId
    })

    setDoc(doc(usersRef, userId), {
        "Posts": arrayUnion(photo_uuid)
    }, { merge: true })
}
