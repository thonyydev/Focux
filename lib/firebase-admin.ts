import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Só roda no servidor (rotas de API). Credenciais vêm da variável
// FIREBASE_SERVICE_ACCOUNT, que contém o JSON da conta de serviço.
function getAdminApp() {
  const existing = getApps()[0];
  if (existing) return existing;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT não está configurada");
  }

  return initializeApp({ credential: cert(JSON.parse(raw)) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
