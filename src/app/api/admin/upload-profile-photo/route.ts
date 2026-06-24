import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo") as File | null;
    const iqamaNumber = formData.get("iqamaNumber") as string;

    if (!file || !iqamaNumber) {
      return NextResponse.json({ error: "Missing photo or iqamaNumber" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileName = `${iqamaNumber}-profile.jpg`;

    // 1. Write locally
    try {
      const localDir = path.join(process.cwd(), "public", "uploads", "profile_photos");
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(path.join(localDir, fileName), fileBuffer);
    } catch (localErr) {
      console.error("Local profile write failed:", localErr);
    }

    // 2. Write to Firebase Storage if configured
    let profilePhotoUrl = `/uploads/profile_photos/${fileName}`;
    const isLive = process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;
    if (isLive) {
      try {
        const bucket = adminStorage.bucket();
        const fileRef = bucket.file(`profile_photos/${fileName}`);
        await fileRef.save(fileBuffer, {
          metadata: { contentType: "image/jpeg" }
        });
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: "01-01-2099"
        });
        profilePhotoUrl = url;
      } catch (fbError) {
        console.warn("Firebase upload failed, falling back to local path.");
      }
    }

    return NextResponse.json({ success: true, profilePhotoUrl });
  } catch (error: any) {
    console.error("Profile upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload photo" }, { status: 500 });
  }
}
