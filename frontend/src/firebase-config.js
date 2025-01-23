import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDqAuIrhD_R3XiGHE8--5FgTBcOcswPwSU",
    authDomain: "electron-dev-398915.firebaseapp.com",
    projectId: "electron-dev-398915",
    storageBucket: "electron-dev-398915.firebasestorage.app",
    messagingSenderId: "10101938465",
    appId: "1:10101938465:web:31374a3c74aa2fa8f24660",
    measurementId: "G-4CCLCC1PZB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider };
