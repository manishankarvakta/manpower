import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "mock-project-id",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "mock@mock-project-id.iam.gserviceaccount.com",
        privateKey: process.env.FIREBASE_PRIVATE_KEY 
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") 
          : "mock-private-key",
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();
const adminStorage = admin.storage();

export { adminDb, adminAuth, adminStorage };
