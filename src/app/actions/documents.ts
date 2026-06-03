"use server"

// Mock OCR Extractor to simulate Google Cloud Vision API
export async function extractDocumentDetails(imageUrl: string, docType: "iqama" | "tub_card") {
  // Simulate network & AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2500));

  if (docType === "iqama") {
    return {
      success: true,
      data: {
        fullName: "Ahmed Al-Farsi",
        iqamaNumber: "2134567890",
        profession: "Senior Electrician",
        expiryDate: "2027-12-01",
        nationality: "Egypt"
      },
      confidence: 0.92 // 92% confidence
    };
  }

  return {
    success: true,
    data: {
      fullName: "Ahmed Al-Farsi",
      cardNumber: "TUB-98765",
      profession: "Electrician",
      companyName: "Saudi Construct Pro",
      expiryDate: "2026-05-15"
    },
    confidence: 0.85
  };
}
