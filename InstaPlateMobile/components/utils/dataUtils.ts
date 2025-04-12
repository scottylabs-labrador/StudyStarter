import React from "react";

import { db } from '@/firebaseConfig';
import { collection, doc, getDoc, arrayUnion, setDoc, Timestamp, getDocsFromServer, getDocFromServer } from 'firebase/firestore';
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

import ImageViewer from '@/components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { selectPhotoProps, uploadProfileImageProps } from "./types";
import { Alert } from "react-native";

export const getPhotoURL = async (docId: string) => {
    // docId: 09ef0f36-c512-4626-a967-765b148478fc
    const storage = getStorage();
    try {
        const reference = ref(storage, '/images/' + docId);
        const url = await getDownloadURL(reference);
        return url;
    } catch {
        // console.log(docId);
        return 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg';
    }

}

export async function getPhotos(db: any, currentUsername: String) {
    const photosCol = collection(db, 'Photos');
    const photoSnapshot = await getDocsFromServer(photosCol);

    // Map through the documents and await each promise
    let photoList = await Promise.all(photoSnapshot.docs.map(async (doc) => ({
        reference: await getPhotoURL(doc.id),
        uploadTime: doc.data().uploadTime,
        userId: doc.data().userId,
    })));

    // Filter out photos where userId matches current user's username (aka posts by the user themself)
    photoList = photoList.filter(photo => photo.userId !== currentUsername);

    // Sort the resolved photoList by uploadTime in descending order
    photoList = photoList.sort((a, b) => b.uploadTime - a.uploadTime);
    return photoList;
}

export async function getGridPhotos(db: any, currentUsername: string) {
    const userDocRef = doc(db, 'Users', currentUsername);
    const userDocSnap = await getDocFromServer(userDocRef);
    if (userDocSnap.exists()) {
        // console.log("Document data:", userDocSnap.data()["Posts"]);
        const uris = userDocSnap.data()["Posts"];

        // Resolve all the promises returned by getPhotoURL
        const resolvedUris = await Promise.all(uris.map(async (uri: string, index: number) => ({
            id: (index + 1).toString(), // id starts from 1
            uri: await getPhotoURL(uri) // Wait for each getPhotoURL call to resolve
        })));

        // Return the resolved URIs
        return resolvedUris;
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document");
    }

}

export const pickProfileImageAsync = async ({selectedImage, setSelectedImage, username}:uploadProfileImageProps) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
    });

    if (!result.canceled) {
        // Compress image because it may be too big and crash the app
        const manipResult = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }], // Resize to 800px width
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setSelectedImage(manipResult.uri);
        uploadProfileImage({selectedImage: manipResult.uri, setSelectedImage, username});
    }
};

export const uploadProfileImage = async ({selectedImage, setSelectedImage, username}:uploadProfileImageProps) => {
    // console.log('uploading picture', selectedImage);
    if (!selectedImage) return;

    const response = await fetch(selectedImage);
    const blob = await response.blob();

    const imgName = `${Date.now()}.jpg`;
    const storageRef = ref(getStorage(), `images/${imgName}`);

    uploadBytes(storageRef, blob).then(async (snapshot) => {

        // profile picture will not be included in the Photos collection
        // await setDoc(doc(db, "Photos", imgName), {
        //     reference: `/boilerplate-7545b.appspot.com/images/${imgName}`,
        //     userId: username,
        //     uploadTime: Timestamp.now()
        // });

        await setDoc(doc(db, "Users", username ?? ''), {
            ProfileImage: imgName
        }, { merge: true });

        Alert.alert('Profile Photo', 'has been uploaded!')
    }).catch((error) => {
        console.error('Error uploading image:', error);
    });
};

interface getProfilePhotoProps {
    db: any,
    currentUsername?: string,
    setSelectedImage:  React.Dispatch<React.SetStateAction<string>>,
    // selectedImage: string,
  };

export const getProfilePhoto = async({db, currentUsername, setSelectedImage}: getProfilePhotoProps) => {
    const userDocRef = doc(db, 'Users', currentUsername ?? "");
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        // console.log("Profile Image:", docSnap.data().ProfileImage);
        const imgURL = await getSinglePhoto(docSnap.data().ProfileImage);
        setSelectedImage(()=>imgURL);
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document");
        return "";
    }
}

export const getSinglePhoto = async(imgName?:string) => {
    if (!imgName) return '';
    const storageRef = ref(getStorage(), `images/${imgName}`);
    const downloadURL = await getDownloadURL(storageRef);

    if (downloadURL) {
        return downloadURL;
    }
    return "";
    
}


// const getSingleDoc = async() => {
//     const docRef = doc(db, "Photos", "09ef0f36-c512-4626-a967-765b148478fc");
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//       } else {
//         // docSnap.data() will be undefined in this case
//         console.log("No such document");
//     }
// }
