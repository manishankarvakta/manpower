"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface WorkerDetailsViewProps {
  worker: any;
}

export function WorkerDetailsView({ worker }: WorkerDetailsViewProps) {
  // Extract all details for rendering
  const details = { ...worker };
  
  // Clean read-only or internal keys from attributes list
  const omitKeys = [
    'id', 
    'profilePhotoUrl', 
    'documentImageUrl', 
    'createdAt', 
    'updatedAt', 
    'role', 
    'extractedDocumentId', 
    'documentType', 
    'verificationStatus'
  ];
  omitKeys.forEach(key => delete details[key]);

  return (
    <Card className="max-w-3xl mx-auto shadow-md">
      <CardHeader className="border-b">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {worker.profilePhotoUrl ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image src={worker.profilePhotoUrl} alt="Profile Photo" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-muted shadow-md text-muted-foreground font-semibold">
              NO PHOTO
            </div>
          )}
          <div className="text-center md:text-left space-y-1.5 flex-1">
            <CardTitle className="text-2xl font-bold">{worker.name || worker.englishName || "Unnamed Worker"}</CardTitle>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                worker.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                worker.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {worker.verificationStatus || "pending"}
              </span>
              <span className="text-sm text-muted-foreground">ID: {worker.id}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-6">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(details).map(([key, value]) => {
            const isArabic = key.toLowerCase().includes("arabic");
            
            // Format property key for display label
            let label = key.replace(/([A-Z])/g, ' $1').trim();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            return (
              <div key={key} className="space-y-1">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</Label>
                <div 
                  className={`p-2.5 bg-muted/30 rounded-md border text-sm ${
                    isArabic ? 'text-right font-medium text-lg' : 'font-medium'
                  }`}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {String(value || "-")}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
