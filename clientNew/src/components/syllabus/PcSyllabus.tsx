import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye, X, Loader } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
interface SyllabusMedia {
    mediaUrl: string;
    public_id: string;
}

interface SyllabusItem {
    _id:string
    user: string;
    semester: string;
    paperCode: string;
    paperName: string;
    media: SyllabusMedia[];
}

interface Props {
    syllabus: SyllabusItem;
    fetchNotice: () => void;
    
}

const PcSyllabus: React.FC<Props> = ({ syllabus ,fetchNotice}) => {
    const [open, setOpen] = useState(false);
const [isLoading,setIsLoading]=useState(false)
    const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");
    const [editPaperCode, setEditPaperCode] = useState(syllabus.paperCode);
const [editPaperName, setEditPaperName] = useState(syllabus.paperName);
const [editSemester, setEditSemester] = useState(syllabus.semester);
const [editFile, setEditFile] = useState<File | null>(null);
const [editLoading, setEditLoading] = useState(false);

const  deleteSyllabus=async()=>{
setIsLoading(true)
    try {
        console.log("syllabus._id=>",syllabus._id);
        
        await apiStore.deleteSyllabus(syllabus._id)
        fetchNotice()
    } catch (error:any) {
        
    }finally{
        setIsLoading(false)
    }
}
const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("paperCode", editPaperCode);
    formData.append("paperName", editPaperName);
    formData.append("semester", editSemester);
    if (editFile) formData.append("media", editFile);

    try {
        setEditLoading(true);
        await apiStore.updateSyllabus(syllabus._id, formData);
        fetchNotice();
    } catch (err) {
        console.error("Edit failed", err);
    } finally {
        setEditLoading(false);
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
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" className="bg-blue-200 hover:bg-blue-400">
                                        <FilePenLine className="text-blue-700" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
    <DialogHeader>
        <DialogTitle>Edit Syllabus</DialogTitle>
        <DialogDescription>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <Input
                    placeholder="Syllabus Code"
                    value={editPaperCode}
                    onChange={(e) => setEditPaperCode(e.target.value)}
                    required
                />
                <Input
                    placeholder="Syllabus Name"
                    value={editPaperName}
                    onChange={(e) => setEditPaperName(e.target.value)}
                    required
                />
                <Select value={editSemester} onValueChange={setEditSemester}>
                    <SelectTrigger className="bg-slate-100">
                        <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                            <SelectItem key={sem} value={sem.toString()}>
                                {sem} Semester
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                        if (e.target.files) setEditFile(e.target.files[0]);
                    }}
                />

                <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
                    {editLoading ? (
                        <>
                            <Loader className="animate-spin mr-2" size={18} />
                            Updating...
                        </>
                    ) : (
                        <>
                            <FilePenLine className="mr-2" size={18} />
                            Update Syllabus
                        </>
                    )}
                </Button>
            </form>
        </DialogDescription>
    </DialogHeader>
</DialogContent>

                                    </Dialog>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit syllabus</p>
                                </TooltipContent>
                            </Tooltip>


                            {/* Delete Button */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="icon" className="bg-red-200 hover:bg-red-400">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <Trash2 className="text-red-700" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                        <p>Delete syllabus</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader className="flex flex-col gap-2">
                                    <DialogTitle>Delete Syllabus?</DialogTitle>
                                    <DialogDescription className="flex flex-col gap-2">
                                        This will permanently delete the syllabus for <b>{syllabus.paperName}</b>.
                                        <Button
                                        onClick={deleteSyllabus}
                                        disabled={isLoading}
                                        className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                        >
                                            {isLoading?<>
                                           
                                                <Loader className="animate-spin text-blue-500 w-6 h-6" /></>:<>
                                                <Trash2 className="mr-2" /> Confirm Delete</>}
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
    {syllabus.media[0] ? (
        isPDF(syllabus.media[0].mediaUrl) ? (
            <PDFPreview
                pdfUrl={syllabus.media[0].mediaUrl}
                fileName={syllabus.media[0].public_id}
            />
        ) : (
            <img
                src={syllabus.media[0].mediaUrl}
                alt="Syllabus preview"
                className="max-h-full max-w-full object-contain rounded-md"
            />
        )
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