// PDFPreview.tsx

import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from "lucide-react";

// Styles required for react-pdf
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { IsMobile } from "../hook/IsMobile";
import { toast } from "sonner";

// Point to the worker you copied into `public/`
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PDFViewerProps {
    pdfUrl: string;
    fileName: string;
    onClose?: () => void;
}

const PDFPreview: React.FC<PDFViewerProps> = ({
    pdfUrl,
    fileName,
    onClose,
}) => {
    const [numPages, setNumPages] = React.useState<number | null>(null);

    const isMobile = IsMobile("(max-width: 768px)");
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };
    // if (isMobile) {
    //     toast.success("It's mobile");
    // } else {
    //     toast.success("It's PC");
    // }
    return (
        <div className="w-full h-[90vh] flex flex-col bg-background border rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b bg-muted">
                <h3 className="text-sm font-medium truncate">{fileName}</h3>
                <div className="flex gap-2 items-center">
                    {/* <Button
  size="icon"
  variant="ghost"
  onClick={async () => {
    try {
      const response = await fetch(pdfUrl, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download PDF. Please try again.");
    }
  }}
  className="h-8 w-8"
  aria-label="Download PDF"
>
  <Download className="w-4 h-4" />
</Button> */}
{isMobile && (
  <Button
    size="icon"
    variant="ghost"
    onClick={async () => {
      try {
        // Fetch the PDF file
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch the PDF file");
        }
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: "application/pdf" });

        // Check if browser supports Web Share API and file sharing
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: fileName,
            text: "Check out this PDF!",
            files: [file],
          });
        } else {
          // Fallback: Trigger file download
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = fileName;
          link.click();
          alert("File sharing not supported. The file will be downloaded instead.");
        }
      } catch (error) {
        console.error("Share failed:", error);
        alert("Failed to share or download the file. Please try again.");
      }
    }}
    className="h-8 w-8"
    aria-label="Share PDF"
  >
    <Share2 className="w-4 h-4" />
  </Button>
)}


                    {onClose && (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onClose}
                            className="h-8 w-8"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1  overflow-auto p-4 bg-white dark:bg-black flex flex-col items-center gap-4 pb-5">
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <p className="text-center text-muted-foreground">
                            Loading PDF…
                        </p>
                    }
                    error={
                        <p className="text-center text-red-500">
                            Failed to load PDF.
                        </p>
                    }
                    className="flex flex-col items-center"
                >
                    {Array.from({ length: numPages ?? 0 }, (_, i) => (
                        <Page
                            key={`page_${i + 1}`}
                            pageNumber={i + 1}
                            width={
                                window.innerWidth < 640
                                    ? window.innerWidth - 40
                                    : 600
                            }
                            renderAnnotationLayer={true}
                            renderTextLayer={true}
                            className="mb-4 shadow"
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
};

export default PDFPreview;
