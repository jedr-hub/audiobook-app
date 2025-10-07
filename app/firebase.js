// app/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAqebH599Iqjt9MOUpSKgq15pLjLt5Omzg",
  authDomain: "audiobook-app-6c167.firebaseapp.com",
  projectId: "audiobook-app-6c167",
  storageBucket: "audiobook-app-6c167.appspot.com",
  messagingSenderId: "760161800147",
  appId: "1:760161800147:web:a30a639dcdc96022fd2926",
  measurementId: "G-ZX9KVB5B1W"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app); 
