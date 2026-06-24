import { getWorkerById } from "@/app/actions/admin";
import { WorkerDetailsView } from "@/components/admin/WorkerDetailsView";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface WorkerDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkerDetailsPage({ params }: WorkerDetailsPageProps) {
  const { id } = await params;
  const result = await getWorkerById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const worker = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/worker">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Worker Details</h1>
            <p className="text-muted-foreground">
              Detailed extracted profile information of the worker.
            </p>
          </div>
        </div>
        <Link href={`/admin/worker/${id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <WorkerDetailsView worker={worker} />
      </div>
    </div>
  );
}
