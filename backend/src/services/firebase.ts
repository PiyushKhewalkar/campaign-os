import admin from 'firebase-admin';

// Initialize Firebase Admin using either GOOGLE_APPLICATION_CREDENTIALS or a base64 JSON in env
if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (serviceAccountBase64) {
    const json = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(json),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

export const firebaseAdminAuth = admin.auth();
export default admin;


