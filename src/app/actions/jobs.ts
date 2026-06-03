"use server"
import { adminDb } from "@/lib/firebase/admin";

export async function createJob(data: Record<string, unknown>) {
  try {
    const jobRef = adminDb.collection("jobs").doc();
    await jobRef.set({
      ...data,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, jobId: jobRef.id };
  } catch (error) {
    console.error("Error creating job", error);
    return { success: false, error: "Failed to create job" };
  }
}
