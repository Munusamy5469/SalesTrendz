import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDzhfJjqsopUDvF5XAOI8W4ROo-WVOsAPw",
  authDomain: "salestrendz-da203.firebaseapp.com",
  projectId: "salestrendz-da203",
  storageBucket: "salestrendz-da203.firebasestorage.app",
  messagingSenderId: "584540165625",
  appId: "1:584540165625:web:29ee0897b09a2664cc1928"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);