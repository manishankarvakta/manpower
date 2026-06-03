"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createWorkerByAdmin } from "@/app/actions/admin";

export function AdminWorkerUploader() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState<string>("iqama");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

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
      toast.success("Document analyzed successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorker = async () => {
    if (!extractedData) return;
    
    setSaving(true);
    try {
      // Map extracted data to worker profile schema, spreading all extracted fields
      const workerData = {
        ...extractedData,
        name: extractedData.englishName || extractedData.name || "",
        iqamaNumber: extractedData.idNumber || extractedData.iqamaNumber || "",
        extractedDocumentId: documentId,
        documentType,
        verificationStatus: "verified", // Admin created it, so assume verified
        email: contactEmail,
        phone: contactPhone,
      };

      const result = await createWorkerByAdmin(workerData);
      
      if (result.success) {
        toast.success("Worker created successfully!");
        router.refresh(); // Tell Next.js to re-fetch Server Components
        setTimeout(() => {
          router.push("/admin/worker");
        }, 100);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create worker.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Select the document type and upload a clear image to autofill the worker profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={documentType} onValueChange={(val) => {
            setDocumentType(val);
            setExtractedData(null); 
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
            {extractedData 
              ? "Review the information before creating the worker."
              : "Verify the information extracted from the document."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>Our AI is reading the document...</p>
            </div>
          ) : extractedData ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {extractedData.profilePhotoUrl && (
                <div className="flex justify-center mb-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                    <Image src={extractedData.profilePhotoUrl} alt="Profile Photo" fill className="object-cover" />
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-muted/50 rounded-lg space-y-4 mb-4 border">
                <h3 className="font-semibold text-sm">Contact Information (Manual Entry)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input 
                      id="contactEmail"
                      type="email" 
                      placeholder="worker@example.com"
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input 
                      id="contactPhone"
                      type="tel" 
                      placeholder="+966 5X XXX XXXX"
                      value={contactPhone} 
                      onChange={e => setContactPhone(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {Object.entries(extractedData)
                .filter(([key]) => key !== 'profilePhotoUrl')
                .map(([key, value]) => {
                  const isArabic = key.toLowerCase().includes("arabic");
                  return (
                    <div key={key} className="space-y-1">
                      <Label className="text-muted-foreground text-xs uppercase">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <Input 
                        defaultValue={String(value) || ""}
                        onChange={(e) => {
                          setExtractedData({
                            ...extractedData,
                            [key]: e.target.value
                          });
                        }}
                        className={`font-medium ${isArabic ? 'text-right dir-rtl' : ''}`}
                      />
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
            <Button 
              className="w-full" 
              onClick={handleCreateWorker}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Worker...
                </>
              ) : (
                "Save and Create Worker"
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
