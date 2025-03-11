// Import the functions you need from the SDKs you need
// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smart-pharmacy-7de76.firebaseapp.com",
  projectId: "smart-pharmacy-7de76",
  storageBucket: "smart-pharmacy-7de76.appspot.com",
  messagingSenderId: "738620748572",
  appId: "1:738620748572:web:bd57d0efb2c7b6ad2e00d9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
