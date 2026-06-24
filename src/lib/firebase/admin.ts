import * as admin from "firebase-admin";

const hasServiceAccount = 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

const options: admin.AppOptions = {
  projectId: process.env.FIREBASE_PROJECT_ID || "manpower-8565b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "manpower-8565b.firebasestorage.app",
};

if (hasServiceAccount) {
  options.credential = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID || "manpower-8565b",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  });
}

if (!admin.apps.length) {
  try {
    admin.initializeApp(options);
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
