import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_QpjSHugeqHKviXgxyYCeFtegj8LfzCg",
  authDomain: "salestrendz-bd3ec.firebaseapp.com",
  projectId: "salestrendz-bd3ec",
  storageBucket: "salestrendz-bd3ec.firebasestorage.app",
  messagingSenderId: "837703622524",
  appId: "1:837703622524:web:d7c9b327faffd24ab6cef9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
