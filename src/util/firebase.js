import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCEP4qgFc1xNF9GABvl-w0I6rcatbjwagU',
  authDomain: 'zovant-security.firebaseapp.com',
  projectId: 'zovant-security',
  storageBucket: 'zovant-security.appspot.com',
  messagingSenderId: '401450610124',
  appId: '1:401450610124:web:55009c41f6476e697e4169',
  measurementId: 'G-RSZTDVNHWX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export default app;
export { auth, database };