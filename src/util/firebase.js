import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

/*
// XXX
// This is the actual production project
const firebaseConfig = {
  apiKey: 'AIzaSyCEP4qgFc1xNF9GABvl-w0I6rcatbjwagU',
  authDomain: 'zovant-security.firebaseapp.com',
  projectId: 'zovant-security',
  storageBucket: 'zovant-security.appspot.com',
  messagingSenderId: '401450610124',
  appId: '1:401450610124:web:55009c41f6476e697e4169',
  measurementId: 'G-RSZTDVNHWX',
};
*/

// This is the development / testing project
const firebaseConfig = {
  apiKey: 'AIzaSyBKtxmwdAU-fUYcIHN7hcf0HLyay40toFc',
  authDomain: 'test-zovant.firebaseapp.com',
  projectId: 'test-zovant',
  storageBucket: 'test-zovant.appspot.com',
  messagingSenderId: '492815649081',
  appId: '1:492815649081:web:f041dd94ac4d1567e280e8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

export default app;
export { auth, database, storage };
