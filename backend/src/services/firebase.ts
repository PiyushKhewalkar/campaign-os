import admin from 'firebase-admin';

// Initialize Firebase Admin using either GOOGLE_APPLICATION_CREDENTIALS or a base64 JSON in env
if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  const projectId = process.env.FIREBASE_PROJECT_ID || 'campaignos-f93ac';

  if (serviceAccountBase64) {
    const json = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(json),
      projectId: projectId,
    });
  } else {
    // For development, we'll use a mock approach or skip Firebase Admin verification
    console.warn('Firebase Admin not properly configured. Google sign-in will use frontend verification only.');
    admin.initializeApp({
      projectId: projectId,
    });
  }
}

export const firebaseAdminAuth: any = admin.auth();
export default admin;


