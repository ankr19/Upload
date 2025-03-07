// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBV6jcIeGCJpCM13gM1-wbOKr5Hwsuu9b4",
  authDomain: "projects-62e1f.firebaseapp.com",
  projectId: "projects-62e1f",
  storageBucket: "projects-62e1f.firebasestorage.app",
  messagingSenderId: "850772018773",
  appId: "1:850772018773:web:d42cf1fb7850905f17b6dc",
  measurementId: "G-WZ6HNRWVHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)
