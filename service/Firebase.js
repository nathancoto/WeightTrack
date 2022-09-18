// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZgqeH1m666YWq4G0s0NROPi8jEbQ0NyM",
  authDomain: "weighttrack-4dba7.firebaseapp.com",
  projectId: "weighttrack-4dba7",
  storageBucket: "weighttrack-4dba7.appspot.com",
  messagingSenderId: "1028754245639",
  appId: "1:1028754245639:web:ca654d63a4e99aaf3cc2a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);