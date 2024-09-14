import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAjojjIvTPyFu_HSRcJUmi0QDgyhmtkeIA",
  authDomain: "crud-4d4ce.firebaseapp.com",
  projectId: "crud-4d4ce",
  storageBucket: "crud-4d4ce.appspot.com",
  messagingSenderId: "918533792420",
  appId: "1:918533792420:web:d3174c6836a137d831bc31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };