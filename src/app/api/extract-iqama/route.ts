import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google Gen AI SDK
// It automatically picks up GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("iqamaImage") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      You are an expert OCR AI specialized in Saudi Arabian documents.
      Extract the details from this Iqama (Saudi Residence Permit) image.
      Return the data strictly as a JSON object conforming to the schema.
    `;

    // Make the request to Gemini
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
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The full name of the resident in English.",
            },
            nameArabic: {
              type: Type.STRING,
              description: "The full name of the resident in Arabic.",
            },
            iqamaNumber: {
              type: Type.STRING,
              description: "The Iqama (Residence Permit) number, usually 10 digits starting with 2.",
            },
            nationality: {
              type: Type.STRING,
              description: "The nationality of the resident in English.",
            },
            profession: {
              type: Type.STRING,
              description: "The job title or profession listed on the Iqama in English.",
            },
            dateOfBirth: {
              type: Type.STRING,
              description: "The date of birth, if present.",
            },
            expiryDate: {
              type: Type.STRING,
              description: "The expiry date of the Iqama (usually in Hijri format).",
            },
            employer: {
              type: Type.STRING,
              description: "The name of the employer or sponsor.",
            },
          },
          required: ["name", "iqamaNumber", "nationality", "profession"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Error extracting Iqama data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
