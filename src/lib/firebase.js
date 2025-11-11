import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBykzDYSr-DNtQW41Y3ufIZdDB75H4b1Lg',
  authDomain: 'jtechsite-2ebc8.firebaseapp.com',
  projectId: 'jtechsite-2ebc8',
  storageBucket: 'jtechsite-2ebc8.firebasestorage.app',
  messagingSenderId: '589329414755',
  appId: '1:589329414755:web:06ee33088387ed1a9b1656',
  measurementId: 'G-0JP00LW81T',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

let analytics;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export { app, analytics, auth, firestore, storage };
