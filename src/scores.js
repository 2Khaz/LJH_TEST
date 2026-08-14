import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const SCORES_COLLECTION = 'scores';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveScore(ms, nickname) {
  await addDoc(collection(db, SCORES_COLLECTION), {
    ms,
    nickname,
    createdAt: serverTimestamp(),
  });
}

export async function getTop(n) {
  const q = query(collection(db, SCORES_COLLECTION), orderBy('ms', 'asc'), limit(n));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}
