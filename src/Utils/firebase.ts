import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBw8mDu7rB-rEp1PyQOOAYqJBd07tqBDpQ",
  authDomain: "itsec2509-2208c.firebaseapp.com",
  projectId: "itsec2509-2208c",
  storageBucket: "itsec2509-2208c.firebasestorage.app",
  messagingSenderId: "235749439227",
  appId: "1:235749439227:web:7e5b3e78ffbf878b05225e",
  measurementId: "G-BSXY1SY68H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();