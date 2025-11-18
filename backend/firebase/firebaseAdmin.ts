import admin from "firebase-admin";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(
  (
    await readFile(
      new URL("../firebase/firebaseServiceAccountKey.json", import.meta.url)
    )
  ).toString() // Convert Buffer to string
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
