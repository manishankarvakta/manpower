"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface IqamaData {
  name?: string;
  nameArabic?: string;
  iqamaNumber?: string;
  nationality?: string;
  profession?: string;
  dateOfBirth?: string;
  expiryDate?: string;
  employer?: string;
}

export function IqamaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<IqamaData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setExtractedData(null); // Reset extracted data on new file selection
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setExtractedData(null);

    const formData = new FormData();
    formData.append("iqamaImage", file);

    try {
      const response = await fetch("/api/extract-iqama", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to extract data");
      }

      setExtractedData(result.data);
      toast.success("Document analyzed successfully!");
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
          <CardTitle>Upload Iqama</CardTitle>
          <CardDescription>
            Upload a clear image of your Iqama to auto-fill your profile details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors">
            {previewUrl ? (
              <div className="relative w-full h-48 overflow-hidden rounded-md mb-4">
                <Image src={previewUrl} alt="Iqama Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
            )}
            
            <Label htmlFor="iqama-upload" className="cursor-pointer">
              <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                {previewUrl ? "Change Image" : "Select Image"}
              </div>
              <Input 
                id="iqama-upload" 
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
            Verify the information extracted from your document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Our AI is reading your document...</p>
            </div>
          ) : extractedData ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase">Full Name (English)</Label>
                <div className="font-medium">{extractedData.name || "N/A"}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs uppercase">Full Name (Arabic)</Label>
                <div className="font-medium text-right dir-rtl">{extractedData.nameArabic || "N/A"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Iqama Number</Label>
                  <div className="font-medium">{extractedData.iqamaNumber || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Nationality</Label>
                  <div className="font-medium">{extractedData.nationality || "N/A"}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Profession</Label>
                  <div className="font-medium">{extractedData.profession || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs uppercase">Expiry Date</Label>
                  <div className="font-medium">{extractedData.expiryDate || "N/A"}</div>
                </div>
              </div>
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
              Confirm & Save
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
