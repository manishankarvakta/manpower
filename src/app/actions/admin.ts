"use server"
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

// Path for local mock database persistence
const MOCK_DB_PATH = path.join(process.cwd(), "mock_db.json");

// Helper to read local mock DB
function readMockDb() {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const initialWorkers = [
      {
        id: "wk_1",
        email: "ahmed@manpower.com",
        displayName: "Ahmed Al-Farsi",
        phone: "+966 50 123 4567",
        role: "worker",
        verificationStatus: "verified",
        profession: "Senior Electrician",
        nationality: "Saudi",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "wk_2",
        email: "mohammad@manpower.com",
        displayName: "Mohammad Khan",
        phone: "+966 55 987 6543",
        role: "worker",
        verificationStatus: "pending",
        profession: "Plumber",
        nationality: "Pakistani",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initialWorkers, null, 2));
    return initialWorkers;
  }
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8"));
  } catch {
    return [];
  }
}

// Helper to write local mock DB
function writeMockDb(data: any[]) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
}

// Check if we are running in mock database mode (no credentials)
const isMockDb = !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;

export async function approveWorkerVerification(workerId: string) {
  if (isMockDb) {
    const db = readMockDb();
    const idx = db.findIndex((u: any) => u.id === workerId);
    if (idx !== -1) {
      db[idx].verificationStatus = "verified";
      db[idx].updatedAt = new Date().toISOString();
      writeMockDb(db);
    }
    return { success: true };
  }

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
  if (isMockDb) {
    const db = readMockDb();
    const idx = db.findIndex((u: any) => u.id === workerId);
    if (idx !== -1) {
      db[idx].verificationStatus = "rejected";
      db[idx].rejectionReason = reason;
      db[idx].updatedAt = new Date().toISOString();
      writeMockDb(db);
    }
    return { success: true };
  }

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
  if (isMockDb) {
    const db = readMockDb();
    const workers = db.filter((u: any) => u.role === "worker");
    return { success: true, data: workers };
  }

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
  if (isMockDb) {
    const db = readMockDb();
    const worker = db.find((u: any) => u.id === workerId);
    if (!worker) {
      return { success: false, error: "Worker not found" };
    }
    return { success: true, data: worker };
  }

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
  const iqamaNumber = data.iqamaNumber || "";

  if (isMockDb) {
    const db = readMockDb();
    if (iqamaNumber) {
      const exists = db.some((u: any) => u.iqamaNumber === iqamaNumber);
      if (exists) {
        return { success: false, error: `Worker with Iqama ID ${iqamaNumber} already exists.` };
      }
    }

    const newId = "wk_" + Math.random().toString(36).substring(2, 11);
    const newWorker = {
      id: newId,
      ...data,
      role: "worker",
      verificationStatus: data.verificationStatus || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.push(newWorker);
    writeMockDb(db);
    
    revalidatePath("/admin/worker");
    return { success: true, id: newId };
  }

  try {
    if (iqamaNumber) {
      const existing = await adminDb.collection("users")
        .where("iqamaNumber", "==", iqamaNumber)
        .limit(1)
        .get();
      if (!existing.empty) {
        return { success: false, error: `Worker with Iqama ID ${iqamaNumber} already exists.` };
      }
    }

    const docRef = await adminDb.collection("users").add({
      ...data,
      role: "worker",
      verificationStatus: data.verificationStatus || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/admin/worker");
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating worker", error);
    return { success: false, error: "Failed to create worker" };
  }
}

export async function updateWorkerByAdmin(workerId: string, data: any) {
  if (isMockDb) {
    const db = readMockDb();
    const idx = db.findIndex((u: any) => u.id === workerId);
    if (idx !== -1) {
      db[idx] = {
        ...db[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      writeMockDb(db);
    }
    return { success: true };
  }

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
  if (isMockDb) {
    let db = readMockDb();
    db = db.filter((u: any) => u.id !== workerId);
    writeMockDb(db);
    return { success: true };
  }

  try {
    await adminDb.collection("users").doc(workerId).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting worker", error);
    return { success: false, error: "Failed to delete worker" };
  }
}

export async function bulkDeleteWorkersByAdmin(workerIds: string[]) {
  if (isMockDb) {
    let db = readMockDb();
    db = db.filter((u: any) => !workerIds.includes(u.id));
    writeMockDb(db);
    return { success: true };
  }

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
