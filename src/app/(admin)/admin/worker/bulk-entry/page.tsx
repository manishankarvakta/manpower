"use client";

import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, UploadCloud, CheckCircle2, AlertCircle, Play, RefreshCw, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createWorkerByAdmin } from "@/app/actions/admin";

interface QueueItem {
  id: string;
  file: File;
  status: "idle" | "extracting" | "saving" | "success" | "error";
  iqamaNumber?: string;
  error?: string;
}

const getItemProgress = (status: string) => {
  switch (status) {
    case "idle": return 0;
    case "extracting": return 40;
    case "saving": return 80;
    case "success": return 100;
    case "error": return 100;
    default: return 0;
  }
};

export default function WorkerBulkEntryPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setIsConfirmed(false);
      setIsFinished(false);
    }
  };

  const confirmUploads = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }
    const items: QueueItem[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      status: "idle",
    }));
    setQueue(items);
    setIsConfirmed(true);
    setIsFinished(false);
    toast.success("Files confirmed! Ready to process.");
  };

  const processQueue = async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setIsFinished(false);
    toast.info(`Starting bulk processing of ${queue.length} documents...`);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === "success") continue;

      setCurrentIndex(i);
      
      // 1. Mark as extracting
      setQueue((prev) =>
        prev.map((q, idx) => (idx === i ? { ...q, status: "extracting" } : q))
      );

      try {
        // 2. Upload to extraction API route
        const formData = new FormData();
        formData.append("documentImage", item.file);
        formData.append("documentType", "iqama");

        const uploadResponse = await fetch("/api/extract-document", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Extraction failed");
        }

        // 3. Mark as saving
        setQueue((prev) =>
          prev.map((q, idx) => (idx === i ? { ...q, status: "saving" } : q))
        );

        const { data: extractedData, documentId } = uploadResult;
        const iqamaId = extractedData.iqamaNumber || extractedData.idNumber || "Unknown";

        // Map extracted data for DB save
        const workerData = {
          ...extractedData,
          name: extractedData.name || extractedData.englishName || "Bulk Worker",
          iqamaNumber: iqamaId,
          extractedDocumentId: documentId,
          role: "worker",
          verificationStatus: "verified",
          email: "",
          phone: "",
        };

        // 4. Save to local mock file / Firestore DB
        const dbResult = await createWorkerByAdmin(workerData);

        if (!dbResult.success) {
          throw new Error(dbResult.error || "Database save failed");
        }

        // 5. Success
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: "success", iqamaNumber: iqamaId } : q
          )
        );
      } catch (error: any) {
        console.error(`Error processing file ${item.file.name}:`, error);
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i
              ? { ...q, status: "error", error: error.message || "Failed" }
              : q
          )
        );
      }
    }

    setIsProcessing(false);
    setCurrentIndex(-1);
    setIsFinished(true);
    toast.success("Bulk processing finished!");
  };

  const resetAll = () => {
    setSelectedFiles([]);
    setQueue([]);
    setIsConfirmed(false);
    setIsFinished(false);
    setCurrentIndex(-1);
  };

  const totalFiles = queue.length;
  const processedFiles = queue.filter((q) => q.status === "success" || q.status === "error").length;
  const successFiles = queue.filter((q) => q.status === "success").length;
  const progressPercent = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/worker">
          <Button variant="outline" size="icon" disabled={isProcessing}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Worker Onboarding</h1>
          <p className="text-muted-foreground">
            Onboard workers by batch-processing their Iqama ID cards sequentially using AI extraction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controller Pane */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle>Batch Controls</CardTitle>
                <CardDescription>Upload files, confirm, and monitor the queue progress.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors cursor-pointer ${
                    isProcessing || isConfirmed ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => !isProcessing && !isConfirmed && fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-10 h-10 text-primary mb-3" />
                  <p className="text-sm font-medium text-center">Click to browse or drop files</p>
                  <p className="text-xs text-muted-foreground text-center mt-1">Select multiple Iqama images</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isProcessing || isConfirmed}
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-3 border text-sm">
                    <p className="font-semibold text-foreground">Selected Files ({selectedFiles.length})</p>
                    <ul className="text-muted-foreground text-xs list-disc pl-4 mt-1 max-h-32 overflow-y-auto space-y-1">
                      {selectedFiles.map((file, idx) => (
                        <li key={idx} className="truncate">{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Indicators */}
                {isConfirmed && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span>Queue Progress</span>
                      <span>{processedFiles} / {totalFiles} Completed</span>
                    </div>
                    <Progress value={progressPercent} className="w-full" />
                  </div>
                )}
              </CardContent>
            </div>

            <CardFooter className="flex flex-col gap-2 border-t pt-4">
              {!isConfirmed ? (
                <Button 
                  className="w-full" 
                  disabled={selectedFiles.length === 0} 
                  onClick={confirmUploads}
                >
                  Confirm Uploads
                </Button>
              ) : (
                <div className="w-full space-y-2">
                  <Button
                    className="w-full"
                    onClick={processQueue}
                    disabled={isProcessing || processedFiles === totalFiles}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing File {queue.findIndex(q => q.status === "extracting" || q.status === "saving") + 1} of {totalFiles}...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Processing
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={resetAll} disabled={isProcessing}>
                    Reset & Start Over
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Right Pane (Cheklist Queue) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <CardTitle>Queue Checklist</CardTitle>
              <CardDescription>Checkbox turns checked and displays the extracted Iqama ID on success.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[450px] p-4 divide-y divide-border">
              {queue.length > 0 ? (
                queue.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  const isSuccess = item.status === "success";
                  const isFailed = item.status === "error";
                  const isProcessingItem = item.status === "extracting" || item.status === "saving";

                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between py-3 px-2 rounded-lg transition-colors ${
                        isActive ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox indicator */}
                        <div 
                          className={`flex items-center justify-center size-5 border rounded transition-colors ${
                            isSuccess 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "border-input bg-background"
                          }`}
                        >
                          {isSuccess && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${isSuccess ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {item.file.name}
                          </p>
                          {item.iqamaNumber && (
                            <p className="text-xs text-primary font-semibold mt-0.5">
                              Iqama ID: {item.iqamaNumber}
                            </p>
                          )}
                          {item.error && (
                            <p className="text-xs text-red-600 font-semibold mt-0.5">
                              Error: {item.error}
                            </p>
                          )}
                          
                          {/* Mini Progress Bar for each item */}
                          {item.status !== "idle" && (
                            <div className="w-full max-w-[240px] mt-2">
                              <Progress 
                                value={getItemProgress(item.status)} 
                                className={`h-1.5 w-full ${
                                  isFailed ? "[&_[data-slot=progress-indicator]]:bg-destructive" : ""
                                }`} 
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.status === "idle" && (
                          <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded font-medium uppercase">
                            Pending
                          </span>
                        )}
                        {item.status === "extracting" && (
                          <span className="text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded font-medium uppercase flex items-center gap-1">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            Extracting
                          </span>
                        )}
                        {item.status === "saving" && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded font-medium uppercase flex items-center gap-1">
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            Saving
                          </span>
                        )}
                        {isSuccess && (
                          <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded font-medium uppercase">
                            Done
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 rounded font-medium uppercase flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                  <UploadCloud className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">Batch list is empty</p>
                  <p className="text-xs opacity-60">Upload and confirm your documents to populate the checklist.</p>
                </div>
              )}
            </CardContent>

            {/* Finished Message Card */}
            {isFinished && (
              <div className="p-4 bg-primary/10 border-t flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
                <h4 className="font-bold text-foreground">All Done!</h4>
                <p className="text-xs text-muted-foreground">
                  Successfully completed processing and saved {successFiles} out of {totalFiles} workers to the database.
                </p>
                <Link href="/admin/worker">
                  <Button size="sm" className="mt-1">Return to Workers list</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
