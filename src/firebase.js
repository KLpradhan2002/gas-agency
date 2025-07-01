import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDiSHvywkWLGUI3CHm3VnhjiC41jQEpK0",
  authDomain: "gas-agency-e3e81.firebaseapp.com",
  projectId: "gas-agency-e3e81",
  storageBucket: "gas-agency-e3e81.firebasestorage.app",
  messagingSenderId: "303918234996",
  appId: "1:303918234996:web:99dd93773993f791408021"
};

const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db = getFirestore(app);

