import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../firebaseServiceAccount.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
}

const firestore = admin.firestore();

export const getDB = () => firestore;
