import { IqamaUploader } from "@/components/IqamaUploader";

export default function TestIqamaPage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Document Extraction Test</h1>
        <p className="text-muted-foreground">
          Test the Gemini AI integration for extracting details from an Iqama.
        </p>
      </div>
      
      <IqamaUploader />
    </div>
  );
}
