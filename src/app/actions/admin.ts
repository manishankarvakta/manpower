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

export async function getWorkers() {
  try {
    const workersSnapshot = await adminDb.collection("users").where("role", "==", "worker").get();
    const workers = workersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      };
    });
    return { success: true, data: workers };
  } catch (error) {
    console.error("Error fetching workers", error);
    return { success: false, error: "Failed to fetch workers" };
  }
}

export async function getWorkerById(workerId: string) {
  try {
    const doc = await adminDb.collection("users").doc(workerId).get();
    if (!doc.exists) {
      return { success: false, error: "Worker not found" };
    }
    const data = doc.data()!;
    return {
      success: true,
      data: {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      }
    };
  } catch (error) {
    console.error("Error fetching worker", error);
    return { success: false, error: "Failed to fetch worker" };
  }
}

export async function createWorkerByAdmin(data: any) {
  try {
    // Basic implementation to create a worker document
    const docRef = await adminDb.collection("users").add({
      ...data,
      role: "worker",
      verificationStatus: data.verificationStatus || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating worker", error);
    return { success: false, error: "Failed to create worker" };
  }
}

export async function updateWorkerByAdmin(workerId: string, data: any) {
  try {
    await adminDb.collection("users").doc(workerId).set({
      ...data,
      updatedAt: new Date(),
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating worker", error);
    return { success: false, error: "Failed to update worker" };
  }
}

export async function deleteWorkerByAdmin(workerId: string) {
  try {
    await adminDb.collection("users").doc(workerId).delete();
    // In a real application, you might also want to delete related documents
    // (e.g. from the 'workers' collection, their applications, their uploaded documents, auth record, etc.)
    return { success: true };
  } catch (error) {
    console.error("Error deleting worker", error);
    return { success: false, error: "Failed to delete worker" };
  }
}

export async function bulkDeleteWorkersByAdmin(workerIds: string[]) {
  try {
    const batch = adminDb.batch();
    
    workerIds.forEach(id => {
      const docRef = adminDb.collection("users").doc(id);
      batch.delete(docRef);
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting workers", error);
    return { success: false, error: "Failed to delete workers in bulk" };
  }
}
