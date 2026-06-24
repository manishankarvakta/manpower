"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportWorkersCsvProps {
  workers: any[];
}

export function ExportWorkersCsv({ workers }: ExportWorkersCsvProps) {
  const handleExport = () => {
    if (!workers || workers.length === 0) return;

    // Defined headers as requested by the user
    const headers = [
      "SL",
      "Name (Arabic)",
      "Name (English)",
      "Iqama Number",
      "Expiry Date",
      "Nationality",
      "CATEGORIES",
      "Occupation (Arabic)",
      "Company Name (Arabic)",
      "Work Area (Arabic)",
      "TRADE",
      "PICTURE"
    ];

    // Build CSV content
    const csvRows = [];
    // Header row
    csvRows.push(headers.map(header => `"${header}"`).join(","));

    // Data rows
    workers.forEach((worker, index) => {
      // Determine file extension for profile photo url if present
      let fileExt = "jpg";
      const photoUrl = worker.profilePhotoUrl || "";
      if (photoUrl) {
        if (photoUrl.includes(".png") || photoUrl.includes("image/png")) {
          fileExt = "png";
        } else if (photoUrl.includes(".jpeg") || photoUrl.includes("image/jpeg")) {
          fileExt = "jpeg";
        } else if (photoUrl.includes(".webp") || photoUrl.includes("image/webp")) {
          fileExt = "webp";
        }
      }
      const iqamaId = worker.iqamaNumber || "";
      const pictureFilename = iqamaId ? `${iqamaId}-profile.${fileExt}` : "";

      const row = [
        String(index + 1), // SL
        worker.nameArabic || "", // Name (Arabic)
        worker.name || "", // Name (English)
        iqamaId, // Iqama Number
        worker.expiryDate || "", // Expiry Date
        worker.nationality || "", // Nationality
        worker.categories || "worker", // CATEGORIES
        worker.professionArabic || "", // Occupation (Arabic)
        worker.employerArabic || "", // Company Name (Arabic)
        worker.placeOfWorkArabic || "", // Work Area (Arabic)
        worker.profession || "", // TRADE
        pictureFilename // PICTURE (photo filename matching the pattern: iqamaid-profile.jpg/png etc.)
      ].map(val => {
        // Escape quotes, remove/normalize newlines, and wrap in quotes
        const strVal = String(val)
          .replace(/"/g, '""')
          .replace(/\r?\n|\r/g, ' ');
        return `"${strVal}"`;
      });
      csvRows.push(row.join(","));
    });

    const csvString = "\uFEFF" + csvRows.join("\n");
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
