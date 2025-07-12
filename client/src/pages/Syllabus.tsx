import React, { useState, useEffect } from "react";
import SyllabusContent from "../components/syllabus/SyllabusContent";
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import apiStore from "../api/apiStore";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Syllabus = () => {
    const departmentid = useAuthStore((state) => state.departmentid);
    const role = useAuthStore((state) => state.role);
    const userId = useAuthStore((state) => state.user._id);

    const [formData, setFormData] = useState({
        semester: "",
        paperCode: "",
        paperName: "",
        file: null,
    });
    const [loading, setLoading] = useState(false);
    const [syllabus, setSyllabus] = useState([]);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
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
        setFormData((prev) => ({ ...prev, file }));
    };

    const fetchSyllabus = async () => {
        
        try {
           const response = await apiStore.syllabusGet(departmentid);
            console.log("response=>", response.data.data);
            setSyllabus(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch syllabus");
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userId || !departmentid) {
            toast.error("User or department information missing");
            setLoading(false);
            return;
        }
        if (!formData.semester) {
            toast.error("Semester is required");
            setLoading(false);
            return;
        }
        if (!formData.paperCode || formData.paperCode.length < 3 || formData.paperCode.length > 10) {
            toast.error("Paper code must be 3-10 characters");
            setLoading(false);
            return;
        }
        if (!formData.file) {
            toast.error("Syllabus file is required");
            setLoading(false);
            return;
        }

        try {
            const syllabusData = new FormData();
            syllabusData.append("user", userId);
            syllabusData.append("department", departmentid);
            syllabusData.append("semester",  formData.semester);
            syllabusData.append("paperCode",  formData.paperCode);
            syllabusData.append("paperName",  formData.paperName);
            syllabusData.append("media",  formData.file);
          
            const response = await apiStore.syllabusCreate(syllabusData)
            console.log("response=> ",response);
            
            toast.success(response.data.message || "Syllabus created successfully");

            setFormData({ semester: "", paperCode: "",paperName:"", file: null });
            e.target.querySelector('input[type="file"]').value = "";
            fetchSyllabus();
        } catch (error) {
            console.error("Syllabus creation failed:", error);
            toast.error(error.response?.data?.message || "Failed to create syllabus");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (departmentid) {
            fetchSyllabus();
        }
    }, [departmentid]);

    return (
        <div className="p-6">
            <motion.div
                className="flex items-center justify-between pb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-2xl font-semibold">Syllabus</h1>
                {(role === "admin" || role === "hod") && (
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="default">+ Add Syllabus</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Syllabus</DialogTitle>
                                <DialogDescription>
                                    <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
                                        <div className="w-full flex gap-4">
                                            <div className="w-1/2">
                                                <Label htmlFor="semester">Semester</Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        handleInputChange("semester", value)
                                                    }
                                                    value={formData.semester}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Semester" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[...Array(8)].map((_, i) => (
                                                            <SelectItem key={i} value={`${i + 1}`}>
                                                                {`${i + 1}st Semester`
                                                                    .replace("1st", `${i + 1}th`)
                                                                    .replace("11th", "11th")
                                                                    .replace("12th", "12th")
                                                                    .replace("13th", "13th")}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-1/2">
                                                <Label htmlFor="paperCode">Paper Code</Label>
                                                <Input
                                                    id="paperCode"
                                                    name="paperCode"
                                                    type="text"
                                                    value={formData.paperCode}
                                                    onChange={(e) =>
                                                        handleInputChange("paperCode", e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                            <div className="w-full">
                                                <Label htmlFor="paperName">Paper Name</Label>
                                                <Input
                                                    id="paperName"
                                                    name="paperName"
                                                    type="text"
                                                    value={formData.paperName}
                                                    onChange={(e) =>
                                                        handleInputChange("paperName", e.target.value)
                                                    }
                                                    required
                                                />
                                            </div>
                                        <div>
                                            <Label htmlFor="doc">Upload Syllabus (PDF, JPEG, PNG, GIF)</Label>
                                            <Input
                                                id="doc"
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                                onChange={handleFileChange}
                                                className="h-[5rem] w-full rounded-md cursor-pointer"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="default"
                                            className="w-full bg-slate-900"
                                            disabled={loading}
                                        >
                                            {loading ? "Creating..." : "Create"}
                                        </Button>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {syllabus.length === 0 ? (
                    <p>No syllabus found</p>
                ) : (
                    <motion.div variants={itemVariants}>
                        <SyllabusContent syllabus={syllabus} refreshSyllabus={fetchSyllabus} />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Syllabus;