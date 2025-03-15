// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSQyNpL6e5kT7bIUEQa0lkdDqXmysnfeo",
  authDomain: "study-group-finder-448404.firebaseapp.com",
  projectId: "study-group-finder-448404",
  storageBucket: "study-group-finder-448404.firebasestorage.app",
  messagingSenderId: "123000629121",
  appId: "1:123000629121:web:19a4c97b6201d0f34e2a80",
  measurementId: "G-H08SNPDWFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const usersRef = collection(db, "Users");
export const photosRef = collection(db, "Photos");
export const storageRef = getStorage(app);