import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  // Substitua estas configurações pelas suas do Firebase Console
  apiKey: "AIzaSyBlTYA8D6hnGm9O71gfXZIV3Dgmre8eeBY",
  authDomain: "assethub-1ea27.firebaseapp.com",
  projectId: "assethub-1ea27",
  storageBucket: "assethub-1ea27.firebasestorage.app",
  messagingSenderId: "132228046322",
  appId: "1:132228046322:web:99e2d31d30c31f4c589f6b",
  measurementId: "G-9EF8KNN7V5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);