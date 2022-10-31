import { initializeApp } from "firebase/app";
import {
GoogleAuthProvider,
getAuth,
signInWithPopup,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
sendPasswordResetEmail,
signOut } from "firebase/auth";
import axios from "axios";

// chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

const firebaseConfig = {
    apiKey: "AIzaSyD6i5I5bGyxme0giPjTSs7EGpp_YDikK4M",
    authDomain: "pdfgen-62cc8.firebaseapp.com",
    projectId: "pdfgen-62cc8",
    storageBucket: "pdfgen-62cc8.appspot.com",
    messagingSenderId: "886102011442",
    appId: "1:886102011442:web:f7a06972f40768f639562b",
    measurementId: "G-3WGHEM4BBP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(app);
const db = {};

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
    // const user = res.user;
    // const config = {
    //   headers: { Authorization: `Bearer ${user.accessToken}`, 'Content-Type': 'application/json' }
    // };
    // const url = `${getHostName()}/profile`;

    // const result = await axios.post(url, config);
    // console.log(result);
  } catch (err) {
    console.error(err);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const registerWithEmailAndPassword = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const token = user.accessToken;
      sessionStorage.setItem('accessToken', token);
      const payload = {
        email: user.email,
        provider: 'password',
        firebaseId: user.uid
      };
      const result = await axios.create({
        baseURL: getHostName(),
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` },
      }).post('/profile', payload);
      console.log(result);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
};