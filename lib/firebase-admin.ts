import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function getFirebaseAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0]!;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "rahman-chess-academy";

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (clientEmail && privateKey) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId,
    });
  }

  return initializeApp({
    projectId,
  });
}

export const adminApp: App = getFirebaseAdminApp();
export const adminAuth: Auth = getAuth(adminApp);

export function hasAdminCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

// Lazy firestore accessor that only initializes if credentials exist
let _firestoreInstance: Firestore | null = null;
export function getAdminFirestore(): Firestore | null {
  if (!hasAdminCredentials()) {
    return null;
  }
  if (!_firestoreInstance) {
    try {
      _firestoreInstance = getFirestore(adminApp);
    } catch (e) {
      console.warn("Could not initialize Firestore Admin:", e);
      return null;
    }
  }
  return _firestoreInstance;
}

export const adminFirestore = {
  collection(name: string) {
    const fs = getAdminFirestore();
    if (!fs) {
      throw new Error("Firestore Admin credentials not configured");
    }
    return fs.collection(name);
  },
  batch() {
    const fs = getAdminFirestore();
    if (!fs) {
      throw new Error("Firestore Admin credentials not configured");
    }
    return fs.batch();
  },
};

export async function verifyAdminRequest(req: Request): Promise<{
  uid: string;
  email?: string;
}> {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) {
    throw new Error("Missing ID token");
  }

  // 1. If service account credentials exist, verify with Admin SDK
  if (hasAdminCredentials()) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      if (decodedToken.admin === false) {
        throw new Error("Forbidden: Not an admin");
      }

      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (adminErr) {
      console.warn("Admin SDK verification fallback to REST API:", adminErr);
    }
  }

  // 2. Fallback: Verify using Firebase Auth REST API (accounts:lookup)
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Authentication configuration missing");
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    }
  );

  const data = await res.json();
  if (!res.ok || !data.users || data.users.length === 0) {
    throw new Error(data.error?.message || "Invalid or expired session. Please sign in again.");
  }

  const user = data.users[0];
  return {
    uid: user.localId,
    email: user.email,
  };
}
