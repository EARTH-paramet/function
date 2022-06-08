import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBou7v2azpDkcMOJWdPSrU9wZCCURgaU0A",
    authDomain: "fir-firebase-d07bc.firebaseapp.com",
    projectId: "fir-firebase-d07bc",
    storageBucket: "fir-firebase-d07bc.appspot.com",
    messagingSenderId: "214608427563",
    appId: "1:214608427563:web:5850acf543aa395dd5086e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  const storage = firebase.storage();

  export {storage,firebase as default};