"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteWorkerButton } from "@/components/admin/DeleteWorkerButton";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bulkDeleteWorkersByAdmin } from "@/app/actions/admin";

interface WorkerDataTableProps {
  workers: any[];
}

export function WorkerDataTable({ workers }: WorkerDataTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(workers.map(w => w.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} worker(s)? This cannot be undone.`)) {
      setIsDeleting(true);
      try {
        const result = await bulkDeleteWorkersByAdmin(Array.from(selectedIds));
        if (result.success) {
          toast.success(`${selectedIds.size} worker(s) deleted successfully.`);
          setSelectedIds(new Set());
          router.refresh();
        } else {
          throw new Error(result.error);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to delete workers.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const allSelected = workers.length > 0 && selectedIds.size === workers.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md border">
          <span className="text-sm font-medium">
            {selectedIds.size} worker(s) selected
          </span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Bulk Delete
          </Button>
        </div>
      )}

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={handleSelectAll} 
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  No workers found.
                </TableCell>
              </TableRow>
            ) : (
              workers.map((worker: any) => (
                <TableRow key={worker.id} data-state={selectedIds.has(worker.id) ? "selected" : undefined}>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={selectedIds.has(worker.id)} 
                      onCheckedChange={(checked) => handleSelectOne(worker.id, !!checked)}
                      aria-label={`Select ${worker.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    {worker.profilePhotoUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                        <Image src={worker.profilePhotoUrl} alt={worker.name || "Worker"} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {worker.name || worker.englishName || "Unnamed Worker"}
                  </TableCell>
                  <TableCell>{worker.email || "-"}</TableCell>
                  <TableCell>{worker.phone || worker.mobileNumber || "-"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      worker.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' : 
                      worker.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {worker.verificationStatus || "pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <Link href={`/admin/worker/${worker.id}/edit`}>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteWorkerButton workerId={worker.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
