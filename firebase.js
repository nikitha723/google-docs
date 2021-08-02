import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyAaQvvr7WItwZiXxjAbKcsBxnkhoH4-RlY",
    authDomain: "docs-clone-87050.firebaseapp.com",
    projectId: "docs-clone-87050",
    storageBucket: "docs-clone-87050.appspot.com",
    messagingSenderId: "53379378008",
    appId: "1:53379378008:web:c66e4861b59a37f253d32d"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  const db = app.firestore();
 
  export { db };