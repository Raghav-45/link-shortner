// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfoncMfA-siVmhFMzvS--r6Nr9pUQDWQA",
  authDomain: "link-shortner-aaed4.firebaseapp.com",
  projectId: "link-shortner-aaed4",
  storageBucket: "link-shortner-aaed4.appspot.com",
  messagingSenderId: "36156931400",
  appId: "1:36156931400:web:c8ee1433c86dc64302077d",
  measurementId: "G-XQ90QTB4LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }