import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4iLRkCK5hZ3ZpC2Q6oadtnhVigk1AcRw",
  authDomain: "dsgt-3e54a.firebaseapp.com",
  projectId: "dsgt-3e54a",
  storageBucket: "dsgt-3e54a.appspot.com",
  messagingSenderId: "225581662533",
  appId: "1:225581662533:web:7219f743c0eef7a1107e2c",
  measurementId: "G-L5Q048FLEX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
connectAuthEmulator(auth, 'http://localhost:8082');

const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8084); 

export { auth, db };
export const analytics = getAnalytics(app);