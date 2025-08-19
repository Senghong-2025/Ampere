import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBsV5zdzZ6zOyXPdiW-1gCvhVakrPRY7BI",
    authDomain: "ampere-53461.firebaseapp.com",
    projectId: "ampere-53461",
    storageBucket: "ampere-53461.firebasestorage.app",
    messagingSenderId: "516541505319",
    appId: "1:516541505319:web:6957aea66cbe9921985302",
    measurementId: "G-BR9DZ1515M"
  };

  const app = initializeApp(firebaseConfig);

  let analytics: ReturnType<typeof getAnalytics> | null = null;
  if (import.meta.client) {
    analytics = getAnalytics(app);
  }
  
  nuxtApp.provide("firebaseApp", app);
  nuxtApp.provide("firebaseAnalytics", analytics);
});