// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgfHKj2cy6kMqtt8w5ynsr9WRa0tc76lo",
  authDomain: "fitflow-b27ec.firebaseapp.com",
  projectId: "fitflow-b27ec",
  storageBucket: "fitflow-b27ec.firebasestorage.app",
  messagingSenderId: "845244296592",
  appId: "1:845244296592:web:2eb68c0e626ff778fbd715",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات لاستخدامها في صفحات الموقع
export const auth = getAuth(app);

// تهيئة Firestore مع تفعيل الكاش ليعمل بسلاسة حتى عند ضعف أو انقطاع الإنترنت
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const storage = getStorage(app);
