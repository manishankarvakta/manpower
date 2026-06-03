import { getWorkerById } from "@/app/actions/admin";
import { EditWorkerForm } from "@/components/admin/EditWorkerForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface EditWorkerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditWorkerPage({ params }: EditWorkerPageProps) {
  const { id } = await params;
  const result = await getWorkerById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const worker = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/worker">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Worker</h1>
          <p className="text-muted-foreground">
            Update profile details for this worker.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <EditWorkerForm worker={worker} />
      </div>
    </div>
  );
}
