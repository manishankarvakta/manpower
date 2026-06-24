import { getWorkers } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ExportWorkersCsv } from "@/components/admin/ExportWorkersCsv";
import { WorkerDataTable } from "@/components/admin/WorkerDataTable";
import Link from "next/link";
import { Plus, Upload } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminWorkerListPage() {
  const { data: workers = [] } = await getWorkers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
          <p className="text-muted-foreground">
            Manage all workers registered on the platform.
          </p>
        </div>
        <div className="flex gap-2">
          <ExportWorkersCsv workers={workers} />
          <Link href="/admin/worker/bulk-entry">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
          </Link>
          <Link href="/admin/worker/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Worker
            </Button>
          </Link>
        </div>
      </div>

      <WorkerDataTable workers={workers} />
    </div>
  );
}
