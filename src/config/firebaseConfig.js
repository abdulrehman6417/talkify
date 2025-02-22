import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUBhV3FDovEtxdxMChG_e522ke39880r0",
  authDomain: "talkify-5377e.firebaseapp.com",
  projectId: "talkify-5377e",
  storageBucket: "talkify-5377e.firebasestorage.app",
  messagingSenderId: "35935102248",
  appId: "1:35935102248:web:e1543555cac37022065c1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
