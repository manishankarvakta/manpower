"use server"
import { adminDb } from "@/lib/firebase/admin";

export async function setUserRole(uid: string, role: "worker" | "contractor") {
  try {
    await adminDb.collection("users").doc(uid).set({
      role: role,
      updatedAt: new Date(),
    }, { merge: true });
    
    // Next steps in a full production environment:
    // await adminAuth.setCustomUserClaims(uid, { role });
    
    return { success: true };
  } catch (error) {
    console.error("Error setting role", error);
    return { success: false, error: "Failed to set role" };
  }
}
