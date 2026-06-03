"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function DocumentUploader() {
  const [documentType, setDocumentType] = useState<string>("iqama");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setExtractedData(null);
      setDocumentId(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setExtractedData(null);
    setDocumentId(null);

    const formData = new FormData();
    formData.append("documentImage", file);
    formData.append("documentType", documentType);

    try {
      const response = await fetch("/api/extract-document", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to extract data");
      }

      setExtractedData(result.data);
      setDocumentId(result.documentId);
      toast.success("Document analyzed and securely saved to database!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Select the document type and upload a clear image to autofill your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={documentType} onValueChange={(val) => {
            setDocumentType(val);
            setExtractedData(null); // Clear previous extractions if type changes
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="iqama">Iqama</TabsTrigger>
              <TabsTrigger value="tub">TUB Card</TabsTrigger>
              <TabsTrigger value="passport">Passport</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors">
            {previewUrl ? (
              <div className="relative w-full h-48 overflow-hidden rounded-md mb-4">
                <Image src={previewUrl} alt="Document Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
            )}
            
            <Label htmlFor="doc-upload" className="cursor-pointer">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                {previewUrl ? "Change Image" : "Select Image"}
              </div>
              <Input 
                id="doc-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUpload} 
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Document...
              </>
            ) : (
              "Extract Details"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Extracted Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Extracted Information
            {extractedData && <CheckCircle className="w-5 h-5 text-green-500" />}
          </CardTitle>
          <CardDescription>
            {documentId 
              ? `Saved to Database (ID: ${documentId})`
              : "Verify the information extracted from your document."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Our AI is reading your document...</p>
            </div>
          ) : extractedData ? (
            <div className="space-y-4">
              {Object.entries(extractedData).map(([key, value]) => {
                const isArabic = key.toLowerCase().includes("arabic");
                return (
                  <div key={key} className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className={`font-medium bg-muted p-2 rounded-md ${isArabic ? 'text-right dir-rtl' : ''}`}>
                      {String(value) || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center">
              <p>Upload an image and click "Extract Details" to see the results here.</p>
            </div>
          )}
        </CardContent>
        {extractedData && (
          <CardFooter>
            <Button variant="outline" className="w-full">
              Confirm Information
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
