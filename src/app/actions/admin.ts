"use server"
import { adminDb } from "@/lib/firebase/admin";

export async function approveWorkerVerification(workerId: string) {
  try {
    await adminDb.collection("users").doc(workerId).set({
      verificationStatus: "verified",
      updatedAt: new Date(),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error("Error approving worker", error);
    return { success: false, error: "Failed to approve worker" };
  }
}

export async function rejectWorkerVerification(workerId: string, reason: string) {
  try {
    await adminDb.collection("users").doc(workerId).set({
      verificationStatus: "rejected",
      rejectionReason: reason,
      updatedAt: new Date(),
    }, { merge: true });
    
    return { success: true };
  } catch (error) {
    console.error("Error rejecting worker", error);
    return { success: false, error: "Failed to reject worker" };
  }
}
