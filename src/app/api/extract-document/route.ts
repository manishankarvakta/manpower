import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { adminDb } from "@/lib/firebase/admin";

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

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Select the appropriate prompt and schema
    let prompt = "";
    let schema: Schema;

    if (documentType === "iqama") {
      prompt = "Extract details from this Saudi Iqama (Residence Permit). Return strictly JSON.";
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

    // Store in Firebase Firestore
    const docRef = await adminDb.collection("extracted_documents").add({
      documentType,
      extractedData: data,
      status: "pending_verification", // Worker needs to verify this later
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      documentId: docRef.id,
      data 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error extracting document data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
