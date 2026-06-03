"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteWorkerByAdmin } from "@/app/actions/admin";

interface DeleteWorkerButtonProps {
  workerId: string;
}

export function DeleteWorkerButton({ workerId }: DeleteWorkerButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this worker? This action cannot be undone.")) {
      setLoading(true);
      try {
        const result = await deleteWorkerByAdmin(workerId);
        if (result.success) {
          toast.success("Worker deleted successfully!");
          router.refresh(); // Refresh the page data
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to delete worker.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading} className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Delete
    </Button>
  );
}
