// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_DB_APIKEY,
  authDomain: import.meta.env.VITE_APP_DB_AUTHDOMAIN,
  databaseURL: import.meta.env.VITE_APP_DB_DATABASEURL,
  projectId: import.meta.env.VITE_APP_DB_PROJECTID,
  storageBucket: import.meta.env.VITE_APP_DB_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_DB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APP_DB_APPID,
  measurementId: import.meta.env.VITE_APP_DB_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {app,db};