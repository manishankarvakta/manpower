import { AdminWorkerUploader } from "@/components/admin/AdminWorkerUploader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewWorkerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/worker">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Worker</h1>
          <p className="text-muted-foreground">
            Upload an Iqama or Passport to automatically extract details and create a worker profile.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AdminWorkerUploader />
      </div>
    </div>
  );
}
