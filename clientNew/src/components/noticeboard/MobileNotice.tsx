import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, FilePenLine, Trash, Trash2 } from "lucide-react";
import PDFPreview from "../common/PDFPreview";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
// import AuthenticateComponent from "@/components/common/AuthenticateComponent"; // adjust import path if needed

interface Media {
  url: string;
  public_id: string;
}

interface Notice {
  _id: string;
  title: string;
  description: string;
  media: Media[];
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  notice: Notice;
}

const MobileNotice: React.FC<Props> = ({ notice }) => {
  const [open, setOpen] = useState(false);

  const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

  const handleEdit = () => {
    // TODO: add navigation or edit logic
    console.log("Edit clicked", notice._id);
  };

  const handleDelete = () => {
    // TODO: call your delete function or confirmation logic
    console.log("Delete clicked", notice._id);
  };

  return (
    <div className="block md:hidden w-full px-4">
      <div className="rounded-xl border bg-card shadow-md p-4 space-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">
            {notice.title}
          </h2>

          <p className="text-sm text-muted-foreground">
            {notice.description}
          </p>
        </div>

        <div className="flex w-full gap-3 ">
  <AuthenticateComponent roles={["hod"]}>
    <div className="flex-1">
      {/* Edit Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-200 hover:bg-blue-400">
            <FilePenLine className="text-blue-700" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Edit Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to edit this notice?
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

    <div className="flex-1">
      {/* Delete Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-red-200 hover:bg-red-400">
            <Trash className="text-red-700" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this notice.
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

  {notice.media.length > 0 && (
    <div className="flex-1">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-base">Preview</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full flex items-center justify-center bg-muted p-2">
            {isPDF(notice.media[0].url) ? (
              <PDFPreview
                pdfUrl={notice.media[0].url}
                fileName={notice.media[0].public_id}
              />
            ) : (
              <img
                src={notice.media[0].url}
                alt="Notice Media"
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
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

export default MobileNotice;
