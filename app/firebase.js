// app/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

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

// ✅ ต้องใช้ getFirestore(app)
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ ถ้ารันใน localhost → เชื่อม Emulator
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  console.log("✅ Connected to Firebase Emulator");
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
}

export { app, db, storage };
