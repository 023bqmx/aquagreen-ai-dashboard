import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Firebase (imported for side effects)
// import './lib/firebase'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB88B5BQM3OJPXZGLFYBZopAOYhOaBQdio",
  authDomain: "arduinosensoralerts.firebaseapp.com",
  databaseURL: "https://arduinosensoralerts-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arduinosensoralerts",
  storageBucket: "arduinosensoralerts.firebasestorage.app",
  messagingSenderId: "806675183717",
  appId: "1:806675183717:web:25cad7f4a99f589fd7ee8c",
  measurementId: "G-Z97HHPZ1Z6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createRoot(document.getElementById("root")!).render(<App />);
