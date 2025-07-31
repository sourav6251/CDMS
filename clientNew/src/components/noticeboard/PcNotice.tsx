import React, {  useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download as DownloadIcon,
  Edit3 as Edit3Icon,
  Eye,
  Loader,
  Trash2,
  X,
} from "lucide-react";
import PDFPreview from "../common/PDFPreview";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
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
import { useAppSelector } from "@/store/reduxHooks";
import { Label } from "@/components/ui/label";

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
  expireDate: string; // ISO date string
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface INoticeboard {
  notices: INotice[];
  fetchNotice: () => void;
}

interface NoticeFormFields {
  title: string;
  description: string;
  expireDate: string; // YYYY-MM-DD (for input[type=date])
  media: File | null;
}

const isPDF = (url: string) => url.toLowerCase().endsWith(".pdf");

const toDateInputValue = (isoLike: string | Date) => {
  // normalize to YYYY-MM-DD for <input type="date">
  const d = new Date(isoLike);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PcNotice: React.FC<INoticeboard> = ({ notices, fetchNotice }) => {
  const role = useAppSelector((state) => state.user.role);

  // Preview Modal
  const [openPreview, setOpenPreview] = useState(false);
  const [fileView, setFileView] = useState("");
  const [fileName, setFileName] = useState("");

  // Edit Dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formField, setFormField] = useState<NoticeFormFields>({
    title: "",
    description: "",
    expireDate: "",
    media: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Helpers
  const getStatus = (expireDate: string) => {
    // Active if expireDate >= today
    const today = new Date();
    const exp = new Date(expireDate);
    // Compare only by date (strip time)
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const expOnly = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());
    return expOnly >= todayOnly ? "Active" : "Expired";
  };

  const openEdit = (notice: INotice) => {
    setEditingId(notice._id);
    setFormError(null);
    setFormField({
      title: notice.title || "",
      description: notice.description || "",
      expireDate: toDateInputValue(notice.expireDate),
      media: null, // user can optionally replace
    });
    setEditOpen(true);
  };

  const onEditFieldChange = (field: keyof NoticeFormFields, value: any) => {
    setFormField((prev) => ({ ...prev, [field]: value }));
  };

  const updateNotice = async () => {
    if (!editingId) return;

    // Basic validation
    if (!formField.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formField.expireDate) {
      setFormError("Expire date is required.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      // If your API expects FormData, uncomment this block and change the call accordingly.
      // const fd = new FormData();
      // fd.append("title", formField.title);
      // fd.append("description", formField.description);
      // fd.append("expireDate", formField.expireDate);
      // if (formField.media) fd.append("media", formField.media);
      // await apiStore.updateNotice(editingId, fd);
const formData={
  title: formField.title,
  description: formField.description,
  expireDate: formField.expireDate,
  media: formField.media, // File | null
}
      await apiStore.updateNotice(editingId, formData);

      setEditOpen(false);
      setEditingId(null);
      setFormField({ title: "", description: "", expireDate: "", media: null });
      fetchNotice();
    } catch (err: any) {
      console.error(err);
      setFormError(err?.message || "Failed to update the notice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNotice = async (noticeId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiStore.deleteNotice(noticeId);
      setDeleteOpen(false);
      setDeletingId(null);
      fetchNotice();
    } catch (error: any) {
      console.error(error);
      setDeleteError(error?.message || "Failed to delete the notice.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <>
      <table className="w-full font-sans border border-[#0ea5e9] dark:border-[#334852]">
        <thead className="bg-[#0ea5e9] dark:bg-[#334852] h-[3rem]">
          <tr className="border border-[#0ea5e9] dark:border-[#334852]">
            <th className="w-[16%] font-sans">Title</th>
            <th className="w-[24%] font-sans">Description</th>
            <th className="w-[12%] font-sans">Status</th>
            <th className="w-[12%] font-sans">Publish Date</th>
            <th className="w-[12%] font-sans">Expire Date</th>
            <th className="w-[12%] font-sans">Published by</th>
            <th className="w-[12%] font-sans">
              {role === "hod" ? "Action" : "View / Download"}
            </th>
          </tr>
        </thead>

        {notices.map((notice) => {
          const media0 = notice.media?.[0];
          const created = new Date(notice.createdAt);
          const description = notice.description || "";
          return (
            <tbody key={notice._id}>
              <tr className="border border-[#0ea5e9] dark:border-[#334852]">
                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                  {notice.title}
                </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] max-w-[300px] whitespace-normal break-words text-center p-1">
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
                </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                <span className={`${ getStatus(notice.expireDate) === "Active" ? "bg-green-600" : "bg-red-600" } p-1 rounded-sm` } >
                  {getStatus(notice.expireDate)}
                </span>
                  </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                  {created.toDateString()}
                </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                  {new Date(notice.expireDate).toLocaleDateString()}
                </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                  HOD
                </td>

                <td className="border border-[#0ea5e9] dark:border-[#334852] text-center p-1">
                  <div className={`grid ${role === "hod" ? "grid-cols-2" : "grid-cols-2"}`}>
                    {media0 && (
                      <Button
                        variant={"ghost"}
                        aria-label="Download File"
                        onClick={() => handleDownload(media0.url, media0.public_id || notice.title)}
                      >
                        <DownloadIcon/>
                      </Button>
                    )}

                    {media0 && (
                      <Button
                        variant={"ghost"}
                        aria-label="Preview File"
                        onClick={() => {
                          setOpenPreview(true);
                          setFileView(media0.url);
                          setFileName(media0.public_id || notice.title);
                        }}
                      >
                        <Eye  />
                      </Button>
                    )}

                    <AuthenticateComponent roles={["hod"]}>
                      <Dialog open={editOpen && editingId === notice._id} onOpenChange={(o) => setEditOpen(o)}>
                        <DialogTrigger asChild>
                          <Button
                            variant={"ghost"}
                            aria-label="Edit Notice"
                            onClick={() => openEdit(notice)}
                          >
                            <Edit3Icon />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-lg w-full max-h-[80vh] overflow-hidden">
                          <DialogHeader className="flex flex-col gap-2">
                            <DialogTitle>Edit Notice</DialogTitle>
                            <DialogDescription>
                              Update the details and click “Save”.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-3 overflow-y-auto max-h-[60vh] ">
                            <div className="space-y-1">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                value={formField.title}
                                onChange={(e) => onEditFieldChange("title", e.target.value)}
                                placeholder="Enter title"
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={formField.description}
                                onChange={(e) => onEditFieldChange("description", e.target.value)}
                                placeholder="Enter description"
                                rows={5}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="expireDate">Expire Date</Label>
                              <Input
                                id="expireDate"
                                type="date"
                                value={formField.expireDate}
                                onChange={(e) => onEditFieldChange("expireDate", e.target.value)}
                              />
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor="media">Replace File (optional)</Label>
                              <Input
                                id="media"
                                type="file"
                                accept="image/*,video/*,application/pdf"
                                onChange={(e) =>
                                  onEditFieldChange("media", e.target.files?.[0] || null)
                                }
                              />
                              {media0 && (
                                <p className="text-xs text-muted-foreground">
                                  Current file: <span className="font-medium">{media0.public_id}</span>
                                </p>
                              )}
                            </div>

                            {formError && (
                              <p className="text-sm text-red-600">{formError}</p>
                            )}

                            <Button
                              onClick={updateNotice}
                              className="w-full"
                              disabled={submitting}
                            >
                              {!submitting ? (
                                <>Save</>
                              ) : (
                                <span className="inline-flex items-center gap-2">
                                  <Loader className="animate-spin w-4 h-4" />
                                  Saving...
                                </span>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={deleteOpen && deletingId === notice._id}
                        onOpenChange={(o) => setDeleteOpen(o)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={"ghost"}
                            aria-label="Delete Notice"
                            onClick={() => {
                              setDeletingId(notice._id);
                              setDeleteError(null);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader className="flex flex-col gap-2">
                            <DialogTitle>Delete this notice?</DialogTitle>
                            <DialogDescription className="flex flex-col gap-2">
                              This action cannot be undone. This will permanently delete the notice and remove its data from our servers.
                              {deleteError && (
                                <span className="text-sm text-red-600">{deleteError}</span>
                              )}
                              <Button
                                className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                onClick={() => deletingId && deleteNotice(deletingId)}
                                disabled={deleting}
                              >
                                {deleting ? (
                                  <span className="inline-flex items-center gap-2">
                                    <Loader className="animate-spin w-4 h-4" />
                                    Deleting...
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Confirm Delete
                                  </span>
                                )}
                              </Button>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </AuthenticateComponent>
                  </div>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>

      {/* Preview Modal */}
      {openPreview && (
        <div className="fixed pt-10 inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-fit max-w-7xl h-[80vh] bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b bg-muted">
              <h3 className="text-lg font-semibold">{fileName}</h3>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={"ghost"}
                  onClick={() => handleDownload(fileView, fileName || "file")}
                  className="h-8 w-8"
                  aria-label="Download File"
                >
                  <DownloadIcon className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  variant={"ghost"}
                  onClick={() => setOpenPreview(false)}
                  aria-label="Close"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="w-full h-full flex items-center justify-center bg-muted px-2 pb-2 pt-10">
              {fileView ? (
                isPDF(fileView) ? (
                  <PDFPreview pdfUrl={fileView} fileName={fileName} />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={fileView}
                      alt="Notice preview"
                      className="max-h-[60vh] max-w-full object-contain rounded-md shadow-md"
                    />
                  </div>
                )
              ) : (
                <div className="p-4 text-center">
                  <p>No file available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PcNotice;
