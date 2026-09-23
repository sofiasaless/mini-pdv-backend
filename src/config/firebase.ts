import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const serviceAccountPath = path.resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
    '../../pdv-mini-firebase-adminsdk-fbsvc-8420029229.json'
);

const raw = JSON.parse(readFileSync(serviceAccountPath, 'utf-8')) as {
  project_id: string;
  client_email: string;
  private_key: string;
};

const serviceAccount: ServiceAccount = {
  projectId: raw.project_id,
  clientEmail: raw.client_email,
  privateKey: raw.private_key,
};

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });
}

export const db = getFirestore();
