// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDs82cPmSJyx2LYOrkprdcU0JItVrnT_uk",
    authDomain: "proiect-isi-28b18.firebaseapp.com",
    projectId: "proiect-isi-28b18",
    storageBucket: "proiect-isi-28b18.appspot.com",
    messagingSenderId: "1051352894411",
    appId: "1:1051352894411:web:ea1c2cd65112cd08b6044e",
    measurementId: "G-1JYQXFFEKE"
  }
};

// Initialize Firebase
const app = initializeApp(environment.firebase);
const analytics = getAnalytics(app);