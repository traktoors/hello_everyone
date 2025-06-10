import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMWBx_vtfqAaUVxd2DI6lhkvQ_pvQU1-4",
  authDomain: "hello-everyone-54e80.firebaseapp.com",
  projectId: "hello-everyone-54e80",
  storageBucket: "hello-everyone-54e80.firebasestorage.app",
  messagingSenderId: "299153507820",
  appId: "1:299153507820:web:9bb845ad936995e5e7acc9",
  measurementId: "G-5PZ4J1TNB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Firestore (used for messages)
const analytics = getAnalytics(app);

export {
  db,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
};