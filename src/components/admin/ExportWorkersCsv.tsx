"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportWorkersCsvProps {
  workers: any[];
}

export function ExportWorkersCsv({ workers }: ExportWorkersCsvProps) {
  const handleExport = () => {
    if (!workers || workers.length === 0) return;

    // Get all unique keys from all workers to use as headers
    const headersSet = new Set<string>();
    workers.forEach(worker => {
      Object.keys(worker).forEach(key => headersSet.add(key));
    });
    
    // Ensure id, name, email are first, and profilePhotoUrl is explicitly included
    const prioritizedHeaders = ["id", "name", "email", "phone", "profilePhotoUrl"];
    const otherHeaders = Array.from(headersSet).filter(h => !prioritizedHeaders.includes(h));
    const headers = [...prioritizedHeaders, ...otherHeaders];

    // Build CSV content
    const csvRows = [];
    // Header row
    csvRows.push(headers.map(header => `"${header}"`).join(","));

    // Data rows
    workers.forEach(worker => {
      const row = headers.map(header => {
        let val = worker[header];
        if (val === null || val === undefined) val = "";
        
        // Escape quotes and wrap in quotes
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `workers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExport} className="gap-2">
      <Download className="w-4 h-4" />
      Export CSV
    </Button>
  );
}
