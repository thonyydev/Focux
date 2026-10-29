import { adminAuth } from "./firebase-admin";

// Identifica o usuário logado a partir do ID token do Firebase enviado em
// "Authorization: Bearer <token>". Retorna null se ausente ou inválido.
export async function getAuthedUser(req: Request) {
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) return null;

  // Fora do try: credencial ausente é erro de configuração (500), não de login (401).
  const auth = adminAuth();

  try {
    return await auth.verifyIdToken(token);
  } catch {
    return null;
  }
}
