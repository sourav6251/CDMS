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
import { Eye, FilePenLine, Loader, Trash, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PDFPreview from "../common/PDFPreview";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import apiStore from "@/api/apiStore"; 

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  fetchNotice: () => void;
}

interface NoticeFormFields {
  title: string;
  description: string;
  media: File | null;
}
const MobileNotice: React.FC<Props> = ({ notice ,fetchNotice}) => {
const [view,setView]=useState(false)

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(notice.title);
    const [description, setDescription] = useState(notice.description || "");
    const [file, setFile] = useState<File | null>(null);
  const isPDF = (url?: string) => {
    if (!url) return false;
    return url.toLowerCase().endsWith(".pdf");
};
    const handleDelete = async () => {
        try {
            await apiStore.deleteNotice(notice._id);
        } catch (error: any) {
            console.error(error);
        } finally {
            fetchNotice();
        }
    };

 const updateNotice = async () => {
        setLoading(true)
        const form: NoticeFormFields = {
            title: title,
            description: description,
            media: file,
        };
        try {
            await apiStore.updateNotice(notice._id, form);
            fetchNotice();
        } catch (err) {
            console.error(err);
        }finally{
        setLoading(false)
        }
    };


  return (
    <div className="block md:hidden w-full px-4">
      <div className="rounded-xl border bg-card shadow-md p-4 space-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">
            {notice.title}
          </h2>

          <p className="text-sm text-muted-foreground">
            {description && description.length > 96 ? (
                                <>
                                  {description.slice(0, 96)}
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <button className="text-blue-500 underline">...more</button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] overflow-hidden">
                                      <DialogHeader>
                                        <DialogTitle>{notice.title}</DialogTitle>
                                      </DialogHeader>
                                      <div className="overflow-y-auto mt-2 text-sm text-gray-700 space-y-2 max-h-[60vh] pr-2">
                                        {description}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              ) : (
                                description || "-"
                              )}
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
        {/* <DialogContent> */}
         
        <DialogContent className="max-w-md w-full  max-h-[80vh] overflow-hidden">
        <DialogTitle className="text-center">Edit Notice</DialogTitle>
                                    <DialogHeader>
                                        <DialogDescription>
                                            Update the details for this notice.
                                        </DialogDescription>
                                    </DialogHeader>
<div className="space-y-3   overflow-y-auto max-h-[60vh] ">
                                    <Input
                                        placeholder="Title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                    />

                                    <Textarea
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />

                                    <Input
                                        type="file"
                                        accept="image/*,video/*,application/pdf"
                                        onChange={(e) =>
                                            setFile(e.target.files?.[0] || null)
                                        }
                                    />

                                    {notice.media &&
                                        notice.media.length > 0 && (
                                            <span className="text-sm text-red-400">
                                                * Media is exist but can't
                                                preview here
                                            </span>
                                        )}

                                    <Button
                                        onClick={updateNotice}
                                        className="w-full mt-4"
                                        disabled={loading}
                                    >
                                       {!loading?<> Submit</>:
                                        <Loader className="animate-spin text-blue-700" />}
                                    </Button>
                                {/* </DialogContent> */}
                                </div>
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
        <DialogTitle className="text-center">Are you absolutely sure?</DialogTitle>
          <DialogHeader className="flex flex-col gap-2">
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
  </AuthenticateComponent >

  {notice.media.length > 0 && (
  <div className="flex-1">
    <Button className="w-full" variant="outline" onClick={() => setView(true)}>
      <Eye className="h-4 w-4" />
    </Button>

    <AnimatePresence>
      {view && (
        <motion.div
          key="media-preview"
          initial={{ opacity: 0 ,y:120}}
          animate={{ opacity: 1 ,y:0}}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", damping: 30 ,duration:0.3}}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        >
          <div className="relative w-full h-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-4 border-b bg-muted">
              <h3 className="text-base font-semibold">Media Preview</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setView(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="h-full w-full flex items-center justify-center bg-muted px-2 py-4">
              {isPDF(notice.media[0].url) ? (
                <PDFPreview
                  pdfUrl={notice.media[0].url}
                  fileName={notice.media[0].public_id}
                />
              ) : (
                <img
                  src={notice.media[0].url}
                  alt="Notice Media"
                  className="max-w-full max-h-[80vh] object-contain rounded"
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

</div>

      </div>
    </div>
  );
};

export default MobileNotice;
