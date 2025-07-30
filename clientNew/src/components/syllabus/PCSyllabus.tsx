import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Eye, X, Loader, Download } from "lucide-react";
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
    _id: string;
    user: string;
    semester: string;
    paperCode: string;
    paperName: string;
    media: SyllabusMedia[];
}

interface Props {
    syllabuses: SyllabusItem[];
    fetchNotice: () => void;
}
const PCSyllabus: React.FC<Props> = ({ syllabuses, fetchNotice }) => {

    const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");
    const [editLoading, setEditLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
    const [viewSyllabus,setViewSyllabus]=useState<SyllabusItem>({
        _id:"",
        paperCode:"",
        paperName:"",
        semester:"",
        user:"",
        media:[]
    })
    useEffect(() => {
        setSyllabus(syllabuses);
    }, [syllabuses]);
    const [editForm, setEditForm] = useState<SyllabusItem>({
        _id: "",
        paperCode: "",
        paperName: "",
        semester: "",
        user: "",
        media: [],
    });

    const [editFile, setEditFile] = useState<File | null>(null);
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("paperCode", editForm.paperCode);
        formData.append("paperName", editForm.paperName);
        formData.append("semester", editForm.semester);
        if (editFile) formData.append("media", editFile);

        try {
            setEditLoading(true);
            await apiStore.updateSyllabus(editForm._id, formData);
            fetchNotice();
        } catch (err) {
            console.error("Edit failed", err);
        } finally {
            setEditLoading(false);
        }
    };
    const handleEditClick = (item: SyllabusItem) => {
        setEditForm(item);
    };
    
    const  deleteSyllabus=async(syabusID:string)=>{
    setIsLoading(true)
        try {
            console.log("syllabus._id=>",syabusID);
            
            await apiStore.deleteSyllabus(syabusID)
            fetchNotice()
        } catch (error:any) {
            
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="w-full pt-5">
            <Table className="w-full">
                <TableCaption>A list of Syllabus</TableCaption>
                <TableHeader className="w-full">
                    <TableRow className="w-full">
                        <TableHead className="w-1/4 text-center">
                            Paper Code
                        </TableHead>
                        <TableHead className="w-1/4 text-center">
                            Paper Name
                        </TableHead>
                        <TableHead className="w-1/4 text-center">
                            Semester
                        </TableHead>
                        <TableHead className=" text-center w-1/4">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="w-full">
                    {syllabus.map((syllabus) => (
                        <TableRow className="w-full" key={syllabus._id}>
                            <TableCell className="font-medium text-center w-1/4">
                                {syllabus.paperCode}
                            </TableCell>
                            <TableCell className="w-1/4 text-center">
                                {syllabus.paperName}
                            </TableCell>
                            <TableCell className="w-1/4 text-center">
                                {syllabus.semester} semester
                            </TableCell>
                            <TableCell className=" text-center w-1/4 ">

                                <div className="flex items-center justify-center gap-2">
                                {/* Edit */}

                                <AuthenticateComponent roles={["hod"]}>
                                    {/* Edit Button */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        className="bg-blue-200 hover:bg-blue-400"
                                                        onClick={() => handleEditClick(syllabus)}
                                                    >
                                                        <FilePenLine className="text-blue-700" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent >
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit Syllabus
                                                        </DialogTitle>
                                                        <DialogDescription asChild>
                                                            <form
                                                                onSubmit={
                                                                    handleEditSubmit
                                                                }
                                                                className="flex flex-col gap-4"
                                                            >
                                                               <Input
                                                                placeholder="Syllabus Code"
                                                                value={editForm.paperCode}
                                                                onChange={(e) =>
                                                                    setEditForm((prev) => ({ ...prev, paperCode: e.target.value }))
                                                                }
                                                                required
                                                                />

                                                                <Input
                                                                placeholder="Syllabus Name"
                                                                value={editForm.paperName}
                                                                onChange={(e) =>
                                                                    setEditForm((prev) => ({ ...prev, paperName: e.target.value }))
                                                                }
                                                                required
                                                                />

                                                                <Select
                                                                value={editForm.semester}
                                                                onValueChange={(value) =>
                                                                    setEditForm((prev) => ({ ...prev, semester: value }))
                                                                }
                                                                >
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

                                                                <Button
                                                                    type="submit"
                                                                    className="bg-blue-500 hover:bg-blue-700"
                                                                >
                                                                    {editLoading ? (
                                                                        <>
                                                                            <Loader  className="animate-spin mr-2" size={ 18 } />
                                                                            Updating...
                                                                        </>
                                                                    ) : (
                                                                        <> <FilePenLine className="mr-2" size={  18 } />  Update Syllabus  </>
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
                                            <Button
                                                size="icon"
                                                className="bg-red-200 hover:bg-red-400"
                                            >
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
                                                <DialogTitle>
                                                    Delete Syllabus?
                                                </DialogTitle>
                                                <DialogDescription className="flex flex-col gap-2">
                                                    This will permanently delete
                                                    the syllabus for
                                                    <b>{syllabus.paperName}</b>.
                                                    <Button
                                                        onClick={()=>deleteSyllabus(syllabus._id)}
                                                        disabled={isLoading}
                                                        className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Loader className="animate-spin text-blue-500 w-6 h-6" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="mr-2" />
                                                                Confirm Delete
                                                            </>
                                                        )}
                                                    </Button>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </AuthenticateComponent>

                                {syllabus.media.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {setOpen(true);setViewSyllabus(syllabus)}}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Custom Modal Popup */}
            {open && (
                <div className="fixed pt-10 inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative w-fit max-w-7xl h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b bg-muted">
                            <h3 className="text-lg font-semibold">
                                Syllabus Preview: {viewSyllabus.paperName}
                            </h3>
                            <div className="flex gap-2">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(viewSyllabus.media[0].mediaUrl, { mode: "cors" });
                                        const blob = await response.blob();
                                        const blobUrl = window.URL.createObjectURL(blob);

                                        const link = document.createElement("a");
                                        link.href = blobUrl;
                                        link.download = viewSyllabus.media[0].public_id;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);

                                        window.URL.revokeObjectURL(blobUrl);
                                    } catch (error) {
                                        console.error("Download failed:", error);
                                        alert("Failed to download file. Please try again.");
                                    }
                                }}
                                className="h-8 w-8"
                                aria-label="Download File"
                            >
                                <Download className="w-4 h-4" />
                            </Button>

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

                        </div>

                        <div className="w-full h-full flex items-center justify-center bg-muted px-2 pb-2 pt-10">
                   
      {viewSyllabus.media[0] ? (
        isPDF(viewSyllabus.media[0].mediaUrl) ? (
            <PDFPreview
                pdfUrl={viewSyllabus.media[0].mediaUrl}
                fileName={viewSyllabus.media[0].public_id}
            />
        ) : (
            <div className="flex flex-col items-center gap-4">
            <img
                src={viewSyllabus.media[0].mediaUrl}
                alt="Syllabus preview"
                className="max-h-[60vh] max-w-full object-contain rounded-md shadow-md"
            />
           
        </div>
        
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
        </div>
    );
};

export default PCSyllabus;
