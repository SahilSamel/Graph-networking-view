// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCad2bXynzg5qYYnt8r5bIVyw_gCCdVamE",
  authDomain: "graph-networking-app.firebaseapp.com",
  projectId: "graph-networking-app",
  storageBucket: "graph-networking-app.appspot.com",
  messagingSenderId: "118413005661",
  appId: "1:118413005661:web:6d14c7334f5a7883400eb4"
};

// Initialize Firebase
const fapp = initializeApp(firebaseConfig);

export default fapp;