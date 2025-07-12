import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../components/ui/select";
import { useAuthStore } from "../store/authStore";
import { Loader2 } from "lucide-react";
import MemberList from "../components/member/MemberList";
import AddMemberDialog from "../components/member/AddMemberDialog";
import { toast } from "sonner";
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

const Members = () => {
    const [display, setDisplay] = useState("hod");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleMemberDeleted = () => {
        setRefreshKey(prev => prev + 1);
    };
    const { token } = useAuthStore();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response =await  apiStore.memberGetByRole(display)
            setData(response.data.data);
            console.log("response=>",response);
        } catch (error) {
            toast.error("Failed to fetch members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [display]);

    return (
        <>
            <motion.div
                className="flex items-center justify-between px-8 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-2xl font-semibold">Members</h1>
                <div className="flex items-center gap-4">
                    <Select
                        value={display}
                        onValueChange={(val) => setDisplay(val)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hod">HOD</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                        </SelectContent>
                    </Select>
                    <AddMemberDialog />
                </div>
            </motion.div>

            {loading ? (
                <div className="w-full h-96 flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin" />
                </div>
            ) : (
                <motion.div
                    className="px-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={itemVariants}>
                    <MemberList data={data} onDelete={handleMemberDeleted} />
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

export default Members;