import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjOSP24dwRUqnbVbYO5alOE_KbBQWovA0",
  authDomain: "registate-4e85a.firebaseapp.com",
  projectId: "registate-4e85a",
  storageBucket: "registate-4e85a.appspot.com",
  messagingSenderId: "7889272935",
  appId: "1:7889272935:web:43609d52b2d9c5fa92d4c2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);