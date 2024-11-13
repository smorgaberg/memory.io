import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCCFYXeW0W3ghTNoDfpFkHIeQgR0x92lQM",
  authDomain: "cyber-columbarium.firebaseapp.com",
  projectId: "cyber-columbarium",
  storageBucket: "cyber-columbarium.appspot.com",
  messagingSenderId: "273748775604",
  appId: "1:273748775604:web:90bc81aff178f7b922fde1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
