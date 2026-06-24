"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { extractDocumentDetails } from "@/app/actions/documents";
import { 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Trash2,
  FileImage,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
  ArrowRight,
  FileCheck2,
  Sparkles,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

type DocType = "iqama" | "tub_card" | "passport";
type DocStatus = "pending" | "processing" | "extracted" | "verified";

interface DocumentItem {
  id: DocType;
  title: string;
  description: string;
  required: boolean;
  status: DocStatus;
  file: File | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extractedData: any | null;
  confidence: number | null;
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "iqama",
    title: "Iqama / ID Card",
    description: "Official Saudi residence permit",
    required: true,
    status: "pending",
    file: null,
    extractedData: null,
    confidence: null
  },
  {
    id: "tub_card",
    title: "TUB Card",
    description: "Technical Update Bureau card",
    required: true,
    status: "pending",
    file: null,
    extractedData: null,
    confidence: null
  },
  {
    id: "passport",
    title: "Passport Copy",
    description: "First and last page (optional)",
    required: false,
    status: "pending",
    file: null,
    extractedData: null,
    confidence: null
  }
];

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [activeDocId, setActiveDocId] = useState<DocType>("iqama");
  const [isDragging, setIsDragging] = useState(false);
  
  // Progress & processing states
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeDoc = documents.find(d => d.id === activeDocId)!;

  const updateDocument = (id: DocType, updates: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc));
  };

  const processFile = async (file: File) => {
    // Validate file
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload a valid image or PDF.");
      return;
    }

    // Set preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    updateDocument(activeDocId, { 
      file, 
      status: "processing", 
      extractedData: null, 
      confidence: null 
    });

    setProcessingProgress(15);
    setProcessingStep("Uploading file securely...");

    // Start progress simulation interval
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 92) {
          clearInterval(interval);
          return 92;
        }
        const next = prev + Math.floor(Math.random() * 12) + 3;
        if (next > 75) {
          setProcessingStep("Comparing data patterns...");
        } else if (next > 45) {
          setProcessingStep("Gemini AI extracting text & photo...");
        }
        return next;
      });
    }, 250);

    try {
      if (activeDocId === "iqama" || activeDocId === "tub_card") {
        const res = await extractDocumentDetails("mock-url", activeDocId);
        clearInterval(interval);
        setProcessingProgress(100);
        setProcessingStep("Extraction complete!");

        setTimeout(() => {
          if (res.success) {
            updateDocument(activeDocId, {
              status: "extracted",
              extractedData: res.data,
              confidence: res.confidence
            });
            toast.success(`${activeDoc.title} analyzed successfully!`);
          } else {
            updateDocument(activeDocId, { status: "pending", file: null });
            setPreviewUrl(null);
            toast.error("Failed to extract details.");
          }
        }, 400);
      } else {
        // Mock processing for passport
        setTimeout(() => {
          clearInterval(interval);
          setProcessingProgress(100);
          setProcessingStep("Extraction complete!");
          
          setTimeout(() => {
            updateDocument(activeDocId, {
              status: "extracted",
              extractedData: { 
                fullName: "Ahmed Al-Farsi",
                passportNumber: "N1234567",
                dateOfBirth: "1992-08-14",
                expiryDate: "2031-10-20",
                nationality: "Egypt"
              },
              confidence: 0.95
            });
            toast.success("Passport copy processed.");
          }, 400);
        }, 2200);
      }
    } catch (error) {
      clearInterval(interval);
      console.error(error);
      updateDocument(activeDocId, { status: "pending", file: null });
      setPreviewUrl(null);
      toast.error("Error processing document. Please try again.");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const removeFile = (id: DocType) => {
    updateDocument(id, { 
      file: null, 
      status: "pending", 
      extractedData: null, 
      confidence: null 
    });
    setPreviewUrl(null);
    setShowPreview(false);
    toast.info("Document removed.");
  };

  const confirmDocument = (id: DocType) => {
    updateDocument(id, { status: "verified" });
    toast.success(`${documents.find(d => d.id === id)?.title} confirmed!`);
    
    // Move to next pending document if available
    const nextPending = documents.find(d => d.status === "pending" && d.id !== id);
    if (nextPending) {
      setActiveDocId(nextPending.id);
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    if (activeDoc.extractedData) {
      const updatedData = { ...activeDoc.extractedData, [key]: value };
      updateDocument(activeDocId, { extractedData: updatedData });
    }
  };

  const handleSubmitAll = async () => {
    setIsSubmitting(true);
    toast.loading("Submitting verified documents to secure servers...");
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.dismiss();
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Documents submitted and verified successfully!");
  };

  // Helper to get status color
  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case "verified": return "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "extracted": return "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400";
      case "processing": return "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400";
      default: return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const overallProgress = (documents.filter(d => d.status === "verified").length / documents.length) * 100;
  const isAllRequiredVerified = documents
    .filter(d => d.required)
    .every(d => d.status === "verified");

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      {!isSubmitted && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-outfit text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Document Verification
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Upload your mandatory documents for verification. Our AI extracts details securely to save you time.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium dark:bg-blue-900/30 dark:text-blue-400 self-start md:self-end">
            <ShieldCheck className="w-4 h-4" />
            End-to-end Encrypted
          </div>
        </div>
      )}

      {isSubmitted ? (
        /* Completion Success State Screen */
        <div className="max-w-3xl mx-auto text-center py-12 px-4 animate-in fade-in duration-700">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 rounded-full blur-2xl bg-emerald-500/20 animate-pulse"></div>
            <div className="w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center relative z-10 mx-auto">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 p-2 rounded-full border-2 border-white dark:border-slate-900 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <h2 className="font-outfit text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Verification Completed!
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
            Great news! Your profile is now 100% complete and fully verified. You are ready to start applying for premium jobs.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10 text-left">
            <Card className="border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/20 dark:bg-emerald-950/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                  Verified Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{doc.title}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-medium">Verified</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                  Extracted Profile Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400 text-xs block">FULL NAME</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documents.find(d => d.id === "iqama")?.extractedData?.fullName || "Ahmed Al-Farsi"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Iqama / ID Card</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documents.find(d => d.id === "iqama")?.extractedData?.iqamaNumber || "2134567890"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">PROFESSION</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {documents.find(d => d.id === "iqama")?.extractedData?.profession || "Senior Electrician"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/worker">
              <Button size="lg" className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/worker/jobs">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload & Extraction */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {activeDoc.title}
                      {activeDoc.required && <Badge variant="destructive" className="text-[10px] uppercase tracking-wider bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-0">Required</Badge>}
                    </CardTitle>
                    <CardDescription className="mt-1">{activeDoc.description}</CardDescription>
                  </div>
                  {activeDoc.status === "verified" && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 border-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                
                {/* Upload State */}
                {activeDoc.status === "pending" && (
                  <div 
                    className={cn(
                      "relative group border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
                      isDragging 
                        ? "border-primary bg-primary/5 dark:bg-primary/10" 
                        : "border-slate-300 hover:border-primary/50 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-primary/50 dark:hover:bg-slate-800/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,application/pdf"
                    />
                    
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <UploadCloud className="w-8 h-8 text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Click to upload or drag and drop
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                      PNG, JPG, JPEG or PDF (max. 10MB). Make sure the document is clear and readable.
                    </p>
                    
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="mx-auto bg-white dark:bg-slate-900"
                    >
                      Select File
                    </Button>
                  </div>
                )}

                {/* Processing / Progress State */}
                {activeDoc.status === "processing" && (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center min-h-[320px] animate-in fade-in duration-500">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse"></div>
                      <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center relative z-10 border border-slate-100 dark:border-slate-700">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {processingStep}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      Our AI is extracting details from {activeDoc.file?.name}.
                    </p>
                    
                    <div className="w-full max-w-xs space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>Analysis status</span>
                        <span>{processingProgress}%</span>
                      </div>
                      <Progress value={processingProgress} className="h-2 w-full" />
                    </div>
                  </div>
                )}

                {/* Extracted/Verified State */}
                {(activeDoc.status === "extracted" || activeDoc.status === "verified") && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    
                    {/* File Preview Control / Panel */}
                    <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <FileImage className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                              {activeDoc.file?.name || "document.jpg"}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {activeDoc.file ? (activeDoc.file.size / 1024 / 1024).toFixed(2) : "1.2"} MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {previewUrl && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowPreview(!showPreview)}
                              className="flex items-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" />
                              {showPreview ? "Hide Preview" : "View File"}
                            </Button>
                          )}
                          
                          {activeDoc.status === "extracted" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                              onClick={() => removeFile(activeDocId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Optional Expandable Preview panel */}
                      {showPreview && previewUrl && (
                        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-100 dark:bg-slate-950 flex justify-center items-center">
                          <div className="relative max-h-96 w-full overflow-auto rounded border border-slate-200 dark:border-slate-800">
                            {activeDoc.file?.type === "application/pdf" ? (
                              <iframe src={previewUrl} className="w-full h-80" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={previewUrl} alt="Document upload preview" className="max-h-80 mx-auto object-contain rounded" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Extracted Data Form / Confirmation controls */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          AI Extracted Details
                        </div>
                        {activeDoc.confidence && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                            {Math.round(activeDoc.confidence * 100)}% Match Confidence
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-5 grid gap-5 sm:grid-cols-2">
                        {activeDoc.extractedData && Object.entries(activeDoc.extractedData).map(([key, value]) => {
                          // Format key from camelCase to Title Case
                          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          
                          return (
                            <div key={key} className="space-y-1.5">
                              <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{formattedKey}</Label>
                              <Input 
                                value={value as string} 
                                onChange={(e) => handleFieldChange(key, e.target.value)}
                                disabled={activeDoc.status === "verified"}
                                className={cn(
                                  "font-medium bg-white dark:bg-slate-950 transition-colors",
                                  activeDoc.status === "verified" && "border-slate-100 bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                                )}
                              />
                            </div>
                          );
                        })}
                      </div>
                      
                      {activeDoc.status === "extracted" && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            Please review details before confirming
                          </p>
                          <Button onClick={() => confirmDocument(activeDocId)}>
                            Confirm Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Status Tracker & Submit Control */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm sticky top-6">
              <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-lg flex items-center justify-between">
                  Document Status
                  <span className="text-sm font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                    {documents.filter(d => d.status === "verified").length} / {documents.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Progress Bar */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Completion</span>
                    <span className="text-slate-900 dark:text-white font-bold">{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                {/* Document List */}
                <div className="p-2">
                  {documents.map((doc) => {
                    const isActive = activeDocId === doc.id;
                    
                    return (
                      <button
                        key={doc.id}
                        onClick={() => {
                          setActiveDocId(doc.id);
                          if (doc.file) {
                            setPreviewUrl(URL.createObjectURL(doc.file));
                          } else {
                            setPreviewUrl(null);
                          }
                          setShowPreview(false);
                        }}
                        className={cn(
                          "w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 border border-transparent",
                          isActive 
                            ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30" 
                            : "hover:bg-slate-50 hover:border-slate-200 dark:hover:bg-slate-800/50 dark:hover:border-slate-700"
                        )}
                      >
                        <div className={cn(
                          "mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          getStatusColor(doc.status)
                        )}>
                          {doc.status === "verified" ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : doc.status === "extracted" || doc.status === "processing" ? (
                            <Clock className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={cn(
                              "text-sm font-semibold truncate transition-colors",
                              isActive ? "text-primary" : "text-slate-900 dark:text-white"
                            )}>
                              {doc.title}
                            </p>
                            {doc.required && doc.status === "pending" && (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {doc.status === "verified" ? "Verified successfully" 
                             : doc.status === "extracted" ? "Needs review" 
                             : doc.status === "processing" ? "Processing..." 
                             : "Pending upload"}
                          </p>
                        </div>
                        
                        <ChevronRight className={cn(
                          "w-4 h-4 mt-2 transition-transform duration-200 shrink-0",
                          isActive ? "text-primary translate-x-1" : "text-slate-300 dark:text-slate-600"
                        )} />
                      </button>
                    );
                  })}
                </div>
              </CardContent>
              
              {/* Action Footer */}
              <CardFooter className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  size="lg"
                  disabled={!isAllRequiredVerified || isSubmitting}
                  onClick={handleSubmitAll}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Documents
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
