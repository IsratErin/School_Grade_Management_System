import admin from "firebase-admin";
import { readFile } from "fs/promises";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
  // Running in production — decode the base64 string
  serviceAccount = JSON.parse(
    Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64"
    ).toString()
  );
} else {
  // Running locally
  serviceAccount = JSON.parse(
    (
      await readFile(
        new URL("../firebaseServiceAccountKey.json", import.meta.url)
      )
    ).toString()
  );
}

// Prevent reinitializing during hot reloads in development
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
