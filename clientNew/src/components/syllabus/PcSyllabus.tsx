import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye, X } from "lucide-react";
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

const PcSyllabus: React.FC<Props> = ({ syllabus }) => {
    const [open, setOpen] = useState(false);

    const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full mx-auto rounded-xl border bg-background shadow p-4 space-y-3 mb-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            {syllabus.paperName} ({syllabus.paperCode})
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Semester {syllabus.semester}
                        </p>
                    </div>
                    
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
                                            <p>Edit syllabus</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="flex flex-col gap-2">
                                        <DialogTitle>Edit Syllabus</DialogTitle>
                                        <DialogDescription>
                                            {/* Edit form would go here */}
                                            Edit form for {syllabus.paperName}
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
                                                <Trash2 className="text-red-700" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Delete syllabus</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className="flex flex-col gap-2">
                                        <DialogTitle>Delete Syllabus?</DialogTitle>
                                        <DialogDescription className="flex flex-col gap-2">
                                            This will permanently delete the syllabus for {syllabus.paperName}.
                                            <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                                                <Trash2 className="mr-2" /> Confirm Delete
                                            </Button>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </AuthenticateComponent>

                        {/* View Button */}
                        {syllabus.media.length > 0 && (
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
            </motion.div>

            {/* Custom Modal Popup */}
            {open && (
                <div className="fixed pt-10 inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative w-fit max-w-7xl h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-muted">
                            <h3 className="text-lg font-semibold">
                                Syllabus Preview: {syllabus.paperName}
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
                            {syllabus.media[0] && isPDF(syllabus.media[0].mediaUrl) ? (
                                <PDFPreview
                                    pdfUrl={syllabus.media[0].mediaUrl}
                                    fileName={syllabus.media[0].public_id}
                                />
                            ) : (
                                <div className="p-4 text-center">
                                    <p>No syllabus available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PcSyllabus;