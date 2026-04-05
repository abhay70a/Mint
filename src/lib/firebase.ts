// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_AOmQcywJg67jZ_yOnd8btIcTK9q7BjY",
  authDomain: "mint-9e870.firebaseapp.com",
  projectId: "mint-9e870",
  storageBucket: "mint-9e870.firebasestorage.app",
  messagingSenderId: "600811406430",
  appId: "1:600811406430:web:680374ca8547143ad4a0cf"
};

// Initialize Firebase (ensure we don't initialize multiple times during hot reloads)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export any other Firebase services you might need below (e.g. auth, db, storage)
// import { getFirestore } from 'firebase/firestore';
// export const db = getFirestore(app);
