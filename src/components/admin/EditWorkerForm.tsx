"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateWorkerByAdmin } from "@/app/actions/admin";
import Image from "next/image";

interface EditWorkerFormProps {
  worker: any;
}

export function EditWorkerForm({ worker }: EditWorkerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Initialize formData with all worker fields except system/read-only fields
  const getInitialFormData = () => {
    const data = { ...worker };
    const omitKeys = ['id', 'profilePhotoUrl', 'createdAt', 'updatedAt', 'role', 'extractedDocumentId', 'documentType'];
    omitKeys.forEach(key => delete data[key]);
    
    // Ensure contact fields exist
    if (!data.email) data.email = "";
    if (!data.phone) data.phone = "";
    
    return data;
  };

  const [formData, setFormData] = useState<Record<string, any>>(getInitialFormData());

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const result = await updateWorkerByAdmin(worker.id, formData);
      if (result.success) {
        toast.success("Worker updated successfully!");
        router.refresh(); // Refresh data first
        setTimeout(() => {
          router.push("/admin/worker");
        }, 100);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update worker.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Worker Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {worker.profilePhotoUrl && (
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <Image src={worker.profilePhotoUrl} alt="Profile Photo" fill className="object-cover" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(formData).map(([key, value]) => {
            const isArabic = key.toLowerCase().includes("arabic");
            // Standardize label
            let label = key.replace(/([A-Z])/g, ' $1').trim();
            label = label.charAt(0).toUpperCase() + label.slice(1);
            
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
                <Input 
                  id={key}
                  value={String(value || "")} 
                  onChange={(e) => handleChange(key, e.target.value)}
                  className={`${isArabic ? 'text-right dir-rtl' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdate} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
