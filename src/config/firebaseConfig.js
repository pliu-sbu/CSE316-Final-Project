import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyC8efxxMSxJCqk3bZYx3EFxAVpdbSq1Q1o",
    authDomain: "cse316-final-project.firebaseapp.com",
    databaseURL: "https://cse316-final-project.firebaseio.com",
    projectId: "cse316-final-project",
    storageBucket: "cse316-final-project.appspot.com",
    messagingSenderId: "507549463305",
    appId: "1:507549463305:web:185d8d8b9b47436a6999d8",
    measurementId: "G-W1H1PB2N9C"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;