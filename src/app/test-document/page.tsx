import { DocumentUploader } from "@/components/DocumentUploader";

export default function TestDocumentPage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Multi-Document AI Extraction Test</h1>
        <p className="text-muted-foreground">
          Test the Gemini AI integration for extracting details from Iqamas, TUB Cards, and Passports.
        </p>
      </div>
      
      <DocumentUploader />
    </div>
  );
}
