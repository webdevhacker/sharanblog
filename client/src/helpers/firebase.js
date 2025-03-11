import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API'),
    authDomain: "sharanblog.firebaseapp.com",
    projectId: "sharanblog",
    storageBucket: "sharanblog.firebasestorage.app",
    messagingSenderId: "982224263323",
    appId: "1:982224263323:web:282eafad9ce052db1b4e3e",
    measurementId: "G-P7VSTTHQN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }