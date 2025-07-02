import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Check if the Firebase config keys are provided and are not the placeholder values.
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.startsWith('your_') &&
  firebaseConfig.projectId
);

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // In a server-side environment, we need to use in-memory cache
    // to avoid issues with IndexedDB persistence not being available.
    // We try to initialize it, but if it fails (e.g. already initialized in dev with HMR),
    // we fall back to getting the existing instance.
    try {
      db = initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch(error) {
        db = getFirestore(app);
    }
  } catch(e) {
    console.error("Failed to initialize Firebase", e);
  }
} else {
  console.warn("Firebase configuration is missing or invalid. Firebase services will be disabled.");
}

export { app, auth, db };
