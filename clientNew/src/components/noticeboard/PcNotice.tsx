import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BellDot, Eye, FilePenLine, Trash, Trash2, X } from "lucide-react";
import PDFPreview from "../common/PDFPreview";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { motion, AnimatePresence } from "framer-motion";
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

const PcNotice: React.FC<Props> = ({ notice }) => {
    const [open, setOpen] = useState(false);

    const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

    return (
        <>
           
           <motion.div
                whileHover={{ scale: 1.01 }}
                // whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-full mx-auto rounded-xl border bg-background shadow p-4 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">
                        {notice.title}
                    </h2>
                    <div className="flex items-center gap-3">
    <AuthenticateComponent roles={["hod"]}>
        {/* Edit Button */}
        <Dialog>
            <DialogTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" className="bg-blue-200 hover:bg-blue-400">
                            <FilePenLine className="text-blue-700" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Edit this meeting</p>
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="flex flex-col gap-2">
                        This action cannot be undone. This will permanently delete meeting and remove your data from our servers.
                        <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                            <Trash2 />
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

        {/* Delete Button */}
        <Dialog>
            <DialogTrigger asChild>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" className="bg-red-200 hover:bg-red-400">
                            <Trash className="text-red-700" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Delete this meeting</p>
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-col gap-2">
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription className="flex flex-col gap-2">
                        This action cannot be undone. This will permanently delete meeting and remove your data from our servers.
                        <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                            <Trash2 />
                        </Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </AuthenticateComponent>

    {/* View Button */}
    {notice.media.length > 0 && (
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

            {/* Custom Modal Popup */}
            {open && (
                <div className="fixed pt-10  inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative w-fit max-w-7xl h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
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

                        {/* Content */}
                        <div className="w-full h-full flex items-center justify-center bg-muted px-2 pb-2  pt-10">
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
                    </div>
                </div>
            )}
        </>
    );
};

export default PcNotice;
