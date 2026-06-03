const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdminUser() {
  const email = 'admin@manpower.com';
  const password = 'AdminPassword123!';
  const displayName = 'System Admin';

  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('User already exists:', userRecord.uid);
      await auth.updateUser(userRecord.uid, { password });
      console.log('Password updated.');
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          displayName,
          emailVerified: true
        });
        console.log('Created new user:', userRecord.uid);
      } else {
        throw e;
      }
    }

    // Set custom claims
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });
    console.log('Custom claims set.');

    // Add to firestore users collection
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('User added to Firestore users collection as admin.');
    console.log(`\nSuccess! You can now login with:\nEmail: ${email}\nPassword: ${password}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
