import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { DownloadCloud, Edit3, Eye, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import apiStore from "../../api/apiStore";

const NoticeContent = ({ notice, refreshNotices }) => {
    const role = useAuthStore((state) => state.role);

    const [editFormData, setEditFormData] = useState({
        title: notice.title,
        description: notice.description,
        file: null,
    });
    const [editLoading, setEditLoading] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }
        if (file && file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }
        setEditFormData((prev) => ({ ...prev, file }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (editFormData.title.length < 3 || editFormData.title.length > 60) {
            toast.error("Title must be 3-60 characters");
            return;
        }
        if (editFormData.description.length < 3 || editFormData.description.length > 500) {
            toast.error("Description must be 3-500 characters");
            return;
        }

        setEditLoading(true);
        try {

            const updateData =new FormData();
            
            updateData.append("title", editFormData.title);
            updateData.append("description", editFormData.description);
            updateData.append("media", editFormData.file);

            const response = await apiStore.noticeboardEdit(notice._id,updateData)
            toast.success(response.data.message || "Notice updated successfully");

            setIsEditDialogOpen(false);
            setEditFormData({ title: "", description: "", file: null });
            if (refreshNotices) refreshNotices();
        } catch (error) {
            console.error("Notice update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update notice");
        } finally {
            setEditLoading(false);
        }
    };
    const handleDownload = async () => {
        if (notice.media && notice.media.length > 0) {
            try {
                let { url } = notice.media[0];
                
                const response = await fetch(url);
                const blob = await response.blob();
                
                const blobUrl = window.URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = blobUrl;
                
                const filename = url.split('/').pop().split('?')[0] || 'notice';
                link.download = filename;
                
                document.body.appendChild(link);
                link.click();
                
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                
            } catch (error) {
                console.error('Download failed:', error);
                toast.error('Failed to download file');
            }
        } else {
            toast.error("No media available for download");
        }
    };
    
    const handleDelete = async () => {
        try {
            await apiStore.noticeboardDelete(notice._id)
            toast.success("Notice deleted successfully");
            if (refreshNotices) {
                await refreshNotices(); // Add await here
            }
            // if (refreshNotices) refreshNotices();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete notice");
        }
    };

    return (
        <Card className="flex flex-row items-start justify-between shadow-sm">
            <div className="w-full">
                <CardHeader>
                    <CardTitle>{notice.title}</CardTitle>
                    <CardDescription className="text-justify line-clamp-3">
                        {notice.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Posted on: {new Date(notice.createdAt).toLocaleDateString()}</p>
                    {notice.media && notice.media.length > 0 && <p>Media: Available</p>}
                </CardContent>
            </div>
            <CardFooter className="py-3 px-3 flex-col gap-3">
                <Sheet>
                    <SheetTrigger>
                        <Button
                            variant={"outline"}
                            className="border-green-600 dark:border-green-500 rounded-full"
                        >
                            <Eye className="text-xl" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>{notice.title}</SheetTitle>
                            <SheetDescription>
                                <p>{notice.description}</p>
                                {notice.media[0].url  !=null && notice.media.length > 0 && (
                                    <div className="mt-4">
                                        <p>Media:</p>
                                        {notice.media[0].url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                            <img
                                                src={notice.media[0].url}
                                                alt="Notice Media"
                                                className="mt-2 max-w-full h-auto"
                                            />
                                        ) : (
                                            <a
                                                href={notice.media[0].url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                View PDF
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p className="mt-4">
                                    Posted on: {new Date(notice.createdAt).toLocaleDateString()}
                                </p>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <Button
                    variant={"outline"}
                    className="border-green-600 dark:border-green-500 rounded-full"
                    onClick={handleDownload}
                >
                    <DownloadCloud />
                </Button>
                {(role === "admin" || role === "hod") && (
                    <>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger>
                                <Button
                                    variant={"outline"}
                                    className="border-green-600 dark:border-green-500 rounded-full"
                                >
                                    <Edit3 />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Notice</DialogTitle>
                                    <DialogDescription>
                                        <form
                                            className="mt-6 flex flex-col gap-5"
                                            onSubmit={handleEditSubmit}
                                        >
                                            <div>
                                                <Label htmlFor="title">Notice title</Label>
                                                <Input
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    value={editFormData.title}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                                <Label htmlFor="description">Notice description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    rows={6}
                                                    value={editFormData.description}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                                <Label htmlFor="doc">Upload new notice (PDF)</Label>
                                                <Input
                                                    id="doc"
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleEditFileChange}
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
                            variant={"destructive"}
                            className="border-red-600 dark:border-red-500 rounded-full"
                            onClick={handleDelete}
                        >
                            <Trash2 />
                        </Button>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

export default NoticeContent;