"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(worker.profilePhotoUrl || null);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);
  
  // Initialize formData with all worker fields except system/read-only fields
  const getInitialFormData = () => {
    const data = { ...worker };
    const omitKeys = ['id', 'profilePhotoUrl', 'documentImageUrl', 'createdAt', 'updatedAt', 'role', 'extractedDocumentId', 'documentType'];
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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoPreview(URL.createObjectURL(file));

      const iqamaId = formData.iqamaNumber || worker.iqamaNumber;
      if (!iqamaId) {
        toast.error("Please ensure Iqama Number is filled before uploading photo.");
        return;
      }

      setUploadingPhoto(true);
      const fd = new FormData();
      fd.append("photo", file);
      fd.append("iqamaNumber", iqamaId);

      try {
        const res = await fetch("/api/admin/upload-profile-photo", {
          method: "POST",
          body: fd
        });
        const result = await res.json();
        if (res.ok && result.success) {
          setNewPhotoUrl(result.profilePhotoUrl);
          toast.success("Profile photo uploaded successfully!");
        } else {
          throw new Error(result.error || "Failed to upload photo");
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to upload photo.");
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData
      };
      if (newPhotoUrl) {
        updateData.profilePhotoUrl = newPhotoUrl;
      }

      const result = await updateWorkerByAdmin(worker.id, updateData);
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
        <div className="flex flex-col items-center gap-4 mb-6">
          {photoPreview ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-muted">
              <Image src={photoPreview} alt="Profile Photo" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed text-xs text-muted-foreground">
              No Photo
            </div>
          )}

          <div className="flex flex-col items-center gap-1.5">
            <Label htmlFor="profile-photo-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background hover:bg-muted text-sm font-medium">
                {uploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Change Profile Photo
              </div>
              <input 
                type="file" 
                id="profile-photo-upload" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                disabled={uploadingPhoto}
                className="hidden" 
              />
            </Label>
            <span className="text-xs text-muted-foreground">
              Upload will match iqamaNumber-profile naming convention
            </span>
          </div>
        </div>

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
        <Button onClick={handleUpdate} disabled={loading || uploadingPhoto} className="w-full">
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
