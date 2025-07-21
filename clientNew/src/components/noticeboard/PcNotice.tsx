import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, FilePenLine, Loader, Trash, Trash2, X } from "lucide-react";
import PDFPreview from "../common/PDFPreview";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { motion } from "framer-motion";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import apiStore from "@/api/apiStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Media {
    url: string;
    public_id: string;
}

interface INotice {
    _id: string;
    title: string;
    description?: string;
    media?: Media[];
    user: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface INoticeboard {
    notice: INotice;
    fetchNotice: () => void;
}
interface NoticeFormFields {
    title: string;
    description: string;
    media: File | null;
}
const PcNotice: React.FC<INoticeboard> = ({ notice, fetchNotice }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(notice.title);
    const [description, setDescription] = useState(notice.description || "");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const media = notice.media ?? [];

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
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full mx-auto rounded-xl border bg-background shadow p-4 space-y-3 mb-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                        {notice.title}
                    </h2>
                    <div className="flex items-center gap-3">
                        <AuthenticateComponent roles={["hod"]}>
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="icon"
                                                className="bg-blue-200 hover:bg-blue-400"
                                            >
                                                <FilePenLine className="text-blue-700" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Edit this notice</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DialogContent className="max-w-md w-full">
                                    <DialogHeader>
                                        <DialogTitle>Edit Notice</DialogTitle>
                                        <DialogDescription>
                                            Update the details for this notice.
                                        </DialogDescription>
                                    </DialogHeader>

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
                                </DialogContent>
                            </Dialog>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="icon"
                                                className="bg-red-200 hover:bg-red-400"
                                            >
                                                <Trash className="text-red-700" />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader className="flex flex-col gap-2">
                                                <DialogTitle>
                                                    Are you absolutely sure?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete the
                                                    notice and remove your data
                                                    from our servers.
                                                </DialogDescription>

                                                <Button
                                                    className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                    onClick={handleDelete}
                                                >
                                                    <Trash2 className="mr-2" />
                                                    Confirm Delete
                                                </Button>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete this notice</p>
                                </TooltipContent>
                            </Tooltip>
                        </AuthenticateComponent>

                        {media.length > 0 && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setOpen(true)}
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <p className="text-muted-foreground text-sm">
                    {notice.description}
                </p>
            </motion.div>

            {open && (
                <div className="fixed pt-10 inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative w-fit max-w-7xl h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-muted">
                            <h3 className="text-lg font-semibold">
                                Media Preview
                            </h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="w-full h-full flex items-center justify-center bg-muted px-2 pb-2 pt-10">
                            {media.length > 0 &&
                                (isPDF(media[0].url) ? (
                                    <PDFPreview
                                        pdfUrl={media[0].url}
                                        fileName={media[0].public_id}
                                    />
                                ) : (
                                    <img
                                        src={media[0].url}
                                        alt="Notice Media"
                                        className="max-w-full max-h-[70vh] object-contain rounded"
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PcNotice;
