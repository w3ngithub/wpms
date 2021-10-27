import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Your web app's Firebase configuration
var firebaseConfig = {
  // apiKey: process.env.REACT_APP_API_KEY,
  // authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_APP_ID,
  // measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  apiKey: "AIzaSyBBvTSiN0xDWF73rFIFwlh4AyC4tbD7zkQ",
  authDomain: "react-trello-26c62.firebaseapp.com",
  projectId: "react-trello-26c62",
  storageBucket: "react-trello-26c62.appspot.com",
  messagingSenderId: "803770741044",
  appId: "1:803770741044:web:bf36f5dd37ef4df7197561",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fireStore = firebase.firestore();

const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export { fireStore, timestamp, firebase };
