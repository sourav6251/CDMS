import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye } from "lucide-react";
import PDFPreview from "../common/PDFPreview";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SyllabusMedia {
  mediaUrl: string;
  public_id: string;
}

interface SyllabusItem {
  user: string;
  semester: string;
  paperCode: string;
  paperName: string;
  media: SyllabusMedia[];
}

interface Props {
  syllabus: SyllabusItem;
}

const MobileSyllabus: React.FC<Props> = ({ syllabus }) => {
  const [open, setOpen] = useState(false);

  const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

  const handleEdit = () => {
    console.log("Edit clicked", syllabus.paperCode);
  };

  const handleDelete = () => {
    console.log("Delete clicked", syllabus.paperCode);
  };

  return (
    <div className="block md:hidden w-full px-4">
      <div className="rounded-xl border bg-card shadow-md p-4 space-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {syllabus.paperName}
            </h2>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {syllabus.paperCode}
              </span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Sem {syllabus.semester}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-3">
          <AuthenticateComponent roles={["hod"]}>
            {/* Edit Button */}
            <div className="flex-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-200 hover:bg-blue-400">
                    <FilePenLine className="text-blue-700" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>Edit Syllabus</DialogTitle>
                    <DialogDescription>
                      Edit syllabus for {syllabus.paperName} ({syllabus.paperCode})
                    </DialogDescription>
                    <Button
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-800"
                      onClick={handleEdit}
                    >
                      Confirm Edit
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            {/* Delete Button */}
            <div className="flex-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-200 hover:bg-red-400">
                    <Trash2 className="text-red-700" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>Delete Syllabus?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete the syllabus for {syllabus.paperName}.
                    </DialogDescription>
                    <Button
                      className="mt-4 bg-red-600 text-white hover:bg-red-800"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2" /> Confirm Delete
                    </Button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </AuthenticateComponent>

          {/* View Button */}
          {syllabus.media.length > 0 && (
            <div className="flex-1">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm h-[90vh] p-0 overflow-hidden">
                  <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-base">
                      {syllabus.paperName} Syllabus
                    </DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-full flex items-center justify-center bg-muted p-2">
                    {isPDF(syllabus.media[0].mediaUrl) ? (
                      <PDFPreview
                        pdfUrl={syllabus.media[0].mediaUrl}
                        fileName={syllabus.media[0].public_id}
                      />
                    ) : syllabus.media[0]?.mediaUrl ? (
                      <img
                        src={syllabus.media[0].mediaUrl}
                        alt="Syllabus Preview"
                        className="max-w-full max-h-[70vh] object-contain rounded"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <p>No syllabus available</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSyllabus;