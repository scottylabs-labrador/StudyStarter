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
  apiKey: "AIzaSyB6uiV4uRJPCJ28S2PQoVPxXCJrtwlmH9M",
  authDomain: "studygroupfinder-14500.firebaseapp.com",
  projectId: "studygroupfinder-14500",
  storageBucket: "gs://studygroupfinder-14500.appspot.com",
  messagingSenderId: "48527787478",
  appId: "1:48527787478:web:acd52f4f64705b171a5077",
  measurementId: "G-8W5PJ0646Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const usersRef = collection(db, "Users");
export const photosRef = collection(db, "Photos");
export const storageRef = getStorage(app);