import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyBsV5zdzZ6zOyXPdiW-1gCvhVakrPRY7BI",
    authDomain: "ampere-53461.firebaseapp.com",
    projectId: "ampere-53461",
    storageBucket: "ampere-53461.firebasestorage.app",
    messagingSenderId: "516541505319",
    appId: "1:516541505319:web:6957aea66cbe9921985302",
    measurementId: "G-BR9DZ1515M"
  };

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  const db = getFirestore(app)
  
  return {
    provide: {
      auth,
      db
    }
  }
});