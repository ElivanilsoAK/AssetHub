import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlTYA8D6hnGm9O71gfXZIV3Dgmre8eeBY",
  authDomain: "assethub-1ea27.firebaseapp.com",
  projectId: "assethub-1ea27",
  storageBucket: "assethub-1ea27.firebasestorage.app",
  messagingSenderId: "132228046322",
  appId: "1:132228046322:web:99e2d31d30c31f4c589f6b",
  measurementId: "G-9EF8KNN7V5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Inicializa serviços
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };