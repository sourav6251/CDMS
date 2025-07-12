import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenIcon, Trash2, ScanEyeIcon, ArrowDownToLine } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import axiosInstance from "../../api/axiosInstance";
import apiStore from "../../api/apiStore";

const SyllabusContent = ({ syllabus = [], refreshSyllabus }) => {
    console.log("syllabus=>", syllabus);

    const [searchTerm, setSearchTerm] = useState("");
    const { role, userId, departmentid } = useAuthStore((state) => ({
        role: state.role,
        userId: state.user?._id,
        departmentid: state.departmentid,
    }));
    const [editFormData, setEditFormData] = useState({
        semester: "",
        paperCode: "",
        paperName: "",
        file: null,
    });
    const [editLoading, setEditLoading] = useState(false);
    const [semesters, setSemesters] = useState([]);

    const filteredData = syllabus.filter(
        (item) =>
            item.paperCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.paperName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDownload = async (media) => {
        try {
            // Check if media exists and has mediaUrl
            if (!media?.mediaUrl) {
                toast.error("No media available for download");
                return;
            }
    
            const mediaUrl = media.mediaUrl;
            console.log("mediaUrl=> ", mediaUrl);
    
            const response = await fetch(mediaUrl);
            const blob = await response.blob();
            
            const blobUrl = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = blobUrl;
            
            const filename = mediaUrl.split('/').pop().split('?')[0] || 'syllabus';
            link.download = filename;
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download file');
        }
    };
    
    const handleDelete = async (syllabusId) => {
        try {
            await apiStore.syllabusDelete(syllabusId)
            toast.success("Syllabus deleted successfully");
            if (refreshSyllabus) await refreshSyllabus();
        } catch (error) {
            console.error("Failed to delete syllabus:", error);
            toast.error(error.response?.data?.message || "Failed to delete syllabus");
        }
    };

    const handleEditInputChange = (name, value) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }
        if (
            file &&
            !["application/pdf", "image/jpeg", "image/png", "image/gif"].includes(file.type)
        ) {
            toast.error("Only PDF, JPEG, PNG, or GIF files are allowed");
            return;
        }
        setEditFormData((prev) => ({ ...prev, file }));
    };

    const handleEditSubmit = async (e, syllabusId) => {
        e.preventDefault();
        setEditLoading(true);

        try {
            const updateData = new FormData();
            updateData.append("semester", editFormData.semester);
            updateData.append("paperCode", editFormData.paperCode);
            updateData.append("paperName", editFormData.paperName);
            updateData.append("media", editFormData.file);
            

            const response =await apiStore.syllabusEdit(syllabusId,updateData)

            toast.success(response.data.message || "Syllabus updated successfully");
            refreshSyllabus();
        } catch (error) {
            console.error("Syllabus update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update syllabus");
        } finally {
            setEditLoading(false);
        }
    };

    const openEditDialog = (syllabus) => {
        setEditFormData({
            semester: syllabus.semester._id || syllabus.semester,
            paperCode: syllabus.paperCode,
            paperName: syllabus.paperName || "",
            file: null,
        });
    };

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await axiosInstance.get("/semesters");
                setSemesters(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch semesters:", error);
            }
        };
        fetchSemesters();
    }, []);

    return (
        <>
            <div className="mb-4 w-full">
                <Input
                    type="text"
                    placeholder="Search by paper code or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <Table>
                <TableCaption>List of all syllabus papers</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-left pl-6">Semester</TableHead>
                        <TableHead className="text-center">Paper Code</TableHead>
                        <TableHead className="text-center">Paper Name</TableHead>
                        <TableHead
                            className={
                                role === "admin" || role === "hod"
                                    ? "text-right pr-[120px]"
                                    : "text-right pr-[60px]"
                            }
                        >
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.length > 0 ? (
                        filteredData.map((syllabus) => (
                            <TableRow key={syllabus._id}>
                                <TableCell className="text-left pl-10">
                                    {syllabus.semester?.name || syllabus.semester}
                                </TableCell>
                                <TableCell className="text-center">{syllabus.paperCode}</TableCell>
                                <TableCell className="text-center">{syllabus.paperName}</TableCell>
                                <TableCell className="text-left">
                                    <div className="w-full flex justify-end pr-5 gap-1">
                                        <Sheet>
                                            <SheetTrigger>
                                                <ScanEyeIcon />
                                            </SheetTrigger>
                                            <SheetContent>
                                                <SheetHeader>
                                                    <SheetTitle className="h-20 w-full flex flex-col justify-center items-center">
                                                        <span className="font-normal">
                                                            {syllabus.semester?.name || syllabus.semester}
                                                        </span>
                                                        <span className="font-normal">
                                                            {syllabus.paperCode}
                                                        </span>
                                                        <span className="font-normal">
                                                            {syllabus.paperName}
                                                        </span>
                                                    </SheetTitle>
                                                   
<SheetDescription>
    {syllabus.media && syllabus.media.length > 0 ? (
        syllabus.media[0].mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img
                src={syllabus.media[0].mediaUrl}
                alt="Syllabus Media"
                className="mt-2 max-w-full h-auto"
            />
        ) : (
            <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(syllabus.media[0].mediaUrl)}&embedded=true`}
                style={{ width: '100%', height: '500px', border: 'none' }}
                title="PDF Viewer"
            />
        )
    ) : (
        "No media available"
    )}
</SheetDescription>
                                                </SheetHeader>
                                            </SheetContent>
                                        </Sheet>

                                        <Button
                                            variant={"ghost"}
                                            
    onClick={() => handleDownload(syllabus.media[0])}
                                        >
                                            <ArrowDownToLine />
                                        </Button>
                                        {(role === "admin" || role === "hod") && (
                                            <>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant={"ghost"}
                                                            onClick={() => openEditDialog(syllabus)}
                                                        >
                                                            <PenIcon />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Syllabus</DialogTitle>
                                                            <DialogDescription>
                                                                <form
                                                                    className="mt-6 flex flex-col gap-5"
                                                                    onSubmit={(e) =>
                                                                        handleEditSubmit(e, syllabus._id)
                                                                    }
                                                                >
                                                                    <div className="w-full flex gap-4">
                                                                        <div className="w-1/2">
                                                                            <Label htmlFor="editSemester">
                                                                                Semester
                                                                            </Label>
                                                                            <Select
                                                                                onValueChange={(value) =>
                                                                                    handleEditInputChange(
                                                                                        "semester",
                                                                                        value
                                                                                    )
                                                                                }
                                                                                value={editFormData.semester}
                                                                            >
                                                                                <SelectTrigger className="w-full">
                                                                                    <SelectValue placeholder="Select Semester" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {semesters.map((semester) => (
                                                                                        <SelectItem
                                                                                            key={semester._id}
                                                                                            value={semester._id}
                                                                                        >
                                                                                            {semester.name}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <div className="w-1/2">
                                                                            <Label htmlFor="editPaperCode">
                                                                                Paper Code
                                                                            </Label>
                                                                            <Input
                                                                                id="editPaperCode"
                                                                                name="paperCode"
                                                                                type="text"
                                                                                value={editFormData.paperCode}
                                                                                onChange={(e) =>
                                                                                    handleEditInputChange(
                                                                                        "paperCode",
                                                                                        e.target.value
                                                                                    )
                                                                                }
                                                                                required
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="editPaperName">
                                                                            Paper Name
                                                                        </Label>
                                                                        <Input
                                                                            id="editPaperName"
                                                                            name="paperName"
                                                                            type="text"
                                                                            value={editFormData.paperName}
                                                                            onChange={(e) =>
                                                                                handleEditInputChange(
                                                                                    "paperName",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                            required
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor="editDoc">
                                                                            Upload New Syllabus (PDF, JPEG, PNG, GIF)
                                                                        </Label>
                                                                        <Input
                                                                            id="editDoc"
                                                                            type="file"
                                                                            accept=".pdf,.jpg,.jpeg,.png,.gif"
                                                                            onChange={handleEditFileChange}
                                                                            className="h-[5rem] w-full rounded-md cursor-pointer"
                                                                        />
                                                                    </div>
                                                                    <Button
                                                                        type="submit"
                                                                        variant="default"
                                                                        className="w-full bg-slate-900"
                                                                        disabled={editLoading}
                                                                    >
                                                                        {editLoading ? "Updating..." : "Update"}
                                                                    </Button>
                                                                </form>
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant={"ghost"}
                                                    onClick={() => handleDelete(syllabus._id)}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center text-gray-400 italic"
                            >
                                No matching syllabus found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
};

export default SyllabusContent;