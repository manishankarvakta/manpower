# Deployment Guide

This guide outlines the steps required to deploy the Saudi Manpower Platform to production securely.

## 1. Firebase Preparation
1. **Create Project:** Set up a project in the [Firebase Console](https://console.firebase.google.com/).
2. **Enable Auth:** Enable Google Sign-In as an authentication provider.
3. **Enable Firestore:** Create a Cloud Firestore database in production mode.
4. **Deploy Security Rules:** 
   Navigate to Firestore -> Rules and ensure your rules strictly enforce role separation as defined in our `security_architecture.md`.
5. **Service Account:** Go to Project Settings -> Service Accounts. Generate a new private key and save the JSON file.

## 2. Vercel Deployment
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Configure the following Environment Variables in Vercel from your Firebase config and Service Account JSON:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` *(Ensure you parse the literal `\n` characters correctly in Vercel)*
4. Deploy the project!

## 3. Initial Admin Setup
Because the `/admin` portal requires an `"admin"` role, you must manually grant the first admin:
1. Log in to the application using your personal Google account.
2. Go to the Firebase Console -> Firestore.
3. Find your user document in the `users` collection.
4. Update your `role` field to `"admin"`.
5. Refresh the application to access the Admin Control Center.
