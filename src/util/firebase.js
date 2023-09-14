import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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
