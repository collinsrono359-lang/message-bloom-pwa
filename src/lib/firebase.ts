import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2AxFHLwLgVHzzYGoh_3YIOLJKqrtlxSw",
  authDomain: "studio-8173715166-ba023.firebaseapp.com",
  projectId: "studio-8173715166-ba023",
  storageBucket: "studio-8173715166-ba023.firebasestorage.app",
  messagingSenderId: "186099836712",
  appId: "1:186099836712:web:f34584a2ca02e204c0921d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
