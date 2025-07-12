import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeClosed, Loader2, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner"; 
const AddMemberDialog = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [role, setRole] = useState(""); 
    const [dept, setDept] = useState(""); 
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]); 
    const [open, setOpen] = useState(false);
    const { token } = useAuthStore();
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get("/department/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDepartments(response.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch departments");
            }
        };
        fetchDepartments();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            let departmentId = dept;
            if (role === "hod" && dept) {
                const deptData = {
                    name: dept,
                    capacity: 100, 
                    totalFaculty: 1, 
                    email: `${dept.toLowerCase().replace(/\s+/g, "")}@college.com`, 
                };
                const deptResponse = await axiosInstance.post("/department/", deptData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                departmentId = deptResponse.data.data._id;
            }

            const userData = {
                name,
                email,
                mobile,
                role,
                password,
                department: departmentId, 
            };
console.log(userData);
            
            const response = await axiosInstance.post("/user/create", userData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Member added successfully!");
            setOpen(false); 
            setName("");
            setEmail("");
            setMobile("");
            setRole("");
            setDept("");
            setPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Fill in the member details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
                    <Input
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {/* <Input
                        type="tel"
                        placeholder="Mobile no"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        pattern="\d{10}"
                        title="Please enter a valid 10-digit mobile number"
                    /> */}
                    <div className="flex flex-col gap-y-2">
                        <div className="border flex items-center rounded-md">
                            <Input
                                id="password"
                                type={isVisible ? "text" : "password"}
                                placeholder="Password"
                                className="border-0 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                            <Button
                                type="button"
                                className="bg-transparent"
                                variant="ghost"
                                onClick={() => setIsVisible(!isVisible)}
                            >
                                {isVisible ? <Eye /> : <EyeClosed />}
                            </Button>
                        </div>
                    </div>

                    <Select value={role} onValueChange={setRole} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hod">HOD</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                    </Select>

                    {role === "hod" ? (
                        <Input
                            placeholder="New Department Name"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                            required
                        />
                    ) : (
                        <Select value={dept} onValueChange={setDept} required={role !== ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((department) => (
                                    <SelectItem key={department._id} value={department._id}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading || !role || !dept}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Save Member"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberDialog;