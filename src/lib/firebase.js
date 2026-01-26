// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8TeewNfSgbQb9Gmr5vPlDdQITz2yDI6c",
  authDomain: "sipline-585ca.firebaseapp.com",
  projectId: "sipline-585ca",
  storageBucket: "sipline-585ca.firebasestorage.app",
  messagingSenderId: "413350991118",
  appId: "1:413350991118:web:cf33c190fc5e03c7a8335f",
  measurementId: "G-4LWYPGW01V",
};

const app = initializeApp(firebaseConfig);

// Messaging only works in browser
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export { getToken, onMessage };
