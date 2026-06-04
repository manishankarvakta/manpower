import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { adminDb, adminStorage } from "@/lib/firebase/admin";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const ai = new GoogleGenAI({});

// Define Schemas for different document types
const iqamaSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Full name in English" },
    nameArabic: { type: Type.STRING, description: "Full name in Arabic" },
    iqamaNumber: { type: Type.STRING, description: "Iqama number (Resident ID), 10 digits" },
    versionNumber: { type: Type.STRING, description: "Version Number (رقم النسخة)" },
    nationality: { type: Type.STRING, description: "Nationality in English" },
    nationalityArabic: { type: Type.STRING, description: "Nationality in Arabic (الجنسية)" },
    profession: { type: Type.STRING, description: "Profession or job title in English" },
    professionArabic: { type: Type.STRING, description: "Profession or job title in Arabic (المهنة)" },
    religion: { type: Type.STRING, description: "Religion in English" },
    religionArabic: { type: Type.STRING, description: "Religion in Arabic (الديانة)" },
    dateOfBirth: { type: Type.STRING, description: "Date of birth (تاريخ الميلاد)" },
    placeOfBirth: { type: Type.STRING, description: "Place of birth in English" },
    placeOfBirthArabic: { type: Type.STRING, description: "Place of birth in Arabic (مكان الميلاد)" },
    expiryDate: { type: Type.STRING, description: "Expiry date (تاريخ الانتهاء)" },
    placeOfIssue: { type: Type.STRING, description: "Place of issue in English" },
    placeOfIssueArabic: { type: Type.STRING, description: "Place of issue in Arabic (مكان الإصدار)" },
    placeOfWork: { type: Type.STRING, description: "Place of work in English" },
    placeOfWorkArabic: { type: Type.STRING, description: "Place of work in Arabic (مكان العمل)" },
    employerId: { type: Type.STRING, description: "Employer ID (هوية صاحب العمل)" },
    employer: { type: Type.STRING, description: "Employer or sponsor name in English" },
    employerArabic: { type: Type.STRING, description: "Employer or sponsor name in Arabic (اسم صاحب العمل)" },
    photoBoundingBox: { 
      type: Type.STRING, 
      description: "Bounding box of the person's photo/face in format [ymin, xmin, ymax, xmax] normalized to 1000. Example: [200, 700, 500, 950]" 
    },
  },
  required: [
    "name", "nameArabic", "iqamaNumber", "nationality", "nationalityArabic",
    "profession", "professionArabic", "employer", "employerArabic"
  ],
};

const tubSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cardNumber: { type: Type.STRING, description: "TUB card number" },
    workerName: { type: Type.STRING, description: "Name of the worker" },
    profession: { type: Type.STRING, description: "Profession listed on the card" },
    expiryDate: { type: Type.STRING, description: "Expiry date of the card" },
    organization: { type: Type.STRING, description: "Organization or company name" },
  },
  required: ["cardNumber", "workerName", "profession"],
};

const passportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    passportNumber: { type: Type.STRING, description: "Passport number" },
    fullName: { type: Type.STRING, description: "Full name" },
    nationality: { type: Type.STRING, description: "Nationality" },
    dateOfBirth: { type: Type.STRING, description: "Date of birth" },
    dateOfIssue: { type: Type.STRING, description: "Date of issue" },
    dateOfExpiry: { type: Type.STRING, description: "Date of expiry" },
  },
  required: ["passportNumber", "fullName", "nationality"],
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("documentImage") as File | null;
    const documentType = formData.get("documentType") as string; // 'iqama', 'tub', 'passport'

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!["iqama", "tub", "passport"].includes(documentType)) {
      return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const base64Data = fileBuffer.toString("base64");

    // Select the appropriate prompt and schema
    let prompt = "";
    let schema: Schema;

    if (documentType === "iqama") {
      prompt = "Extract details from this Saudi Iqama (Residence Permit). Make sure to extract the bounding box for the profile photo. Return strictly JSON.";
      schema = iqamaSchema;
    } else if (documentType === "tub") {
      prompt = "Extract details from this Saudi TUB card. Return strictly JSON.";
      schema = tubSchema;
    } else {
      prompt = "Extract details from this Passport. Return strictly JSON.";
      schema = passportSchema;
    }

    // Request to Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: file.type || "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const data = JSON.parse(response.text || "{}");

    let profilePhotoUrl = null;

    // Handle photo cropping if bounding box is provided
    if (data.photoBoundingBox) {
      try {
        const bboxMatches = data.photoBoundingBox.match(/\[?(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\]?/);
        if (bboxMatches) {
          const [_, ymin, xmin, ymax, xmax] = bboxMatches.map(Number);
          
          // Get original image dimensions
          const metadata = await sharp(fileBuffer).metadata();
          const { width, height } = metadata;

          if (width && height) {
            // Convert normalized coordinates (0-1000) to pixel values
            const left = Math.round((xmin / 1000) * width);
            const top = Math.round((ymin / 1000) * height);
            const cropWidth = Math.round(((xmax - xmin) / 1000) * width);
            const cropHeight = Math.round(((ymax - ymin) / 1000) * height);

            // Crop image
            const croppedBuffer = await sharp(fileBuffer)
              .extract({ left, top, width: cropWidth, height: cropHeight })
              .toFormat("jpeg")
              .toBuffer();

            // Save to local server file system (public/uploads/profile_photos)
            // Use iqamaNumber for filename if available, otherwise fallback to uuid
            const baseFileName = data.iqamaNumber || data.cardNumber || data.passportNumber || uuidv4();
            const fileName = `${baseFileName}.jpg`;
            
            // Upload to Firebase Storage instead of local public folder
            // Local files added at runtime are not served by Next.js until restart
            const bucket = adminStorage.bucket();
            const fileRef = bucket.file(`profile_photos/${fileName}`);
            
            await fileRef.save(croppedBuffer, {
              metadata: {
                contentType: 'image/jpeg',
              }
            });
            
            // Get a long-lived signed URL so the Next.js Image component can load it
            const [url] = await fileRef.getSignedUrl({
              action: 'read',
              expires: '01-01-2099' // Far future expiry
            });

            profilePhotoUrl = url;
            data.profilePhotoUrl = profilePhotoUrl;
          }
        }
      } catch (cropError) {
        console.error("Error cropping image:", cropError);
        // Continue saving document even if cropping fails
      }
    }

    // Store in Firebase Firestore
    const docRef = await adminDb.collection("extracted_documents").add({
      documentType,
      extractedData: data,
      profilePhotoUrl,
      status: "pending_verification",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      documentId: docRef.id,
      data,
      profilePhotoUrl
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error extracting document data:", error);
    
    // Check if it's a Gemini rate limit error
    if (error.message?.includes("429") || error.message?.includes("Quota exceeded") || error.status === 429) {
      return NextResponse.json(
        { error: "AI Rate Limit Exceeded. The free tier of the AI model is currently maxed out. Please try again in about 1 minute." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
