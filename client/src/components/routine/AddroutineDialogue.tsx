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
import { Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/authStore";

const AddRoutineDialog = ({ onRoutineAdded }) => {
    const [paperCode, setPaperCode] = useState("");
    const [professor, setProfessor] = useState("");
    const [classType, setClassType] = useState("");
    const [semester, setSemester] = useState("");
    const [day, setDay] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [facultyList, setFacultyList] = useState([]);
    const [fetchingFaculty, setFetchingFaculty] = useState(false);

    const role = useAuthStore((state) => state.role);
    const userID = useAuthStore((state) => state.user._id);
    const departmentid = useAuthStore((state) => state.departmentid);

    useEffect(() => {
        const fetchFaculty = async () => {
            setFetchingFaculty(true);
            try {
                const response = await axiosInstance.get("/user/getbyfaculty");
                setFacultyList(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setFetchingFaculty(false);
            }
        };

        fetchFaculty();
    }, []);

    const handleAddRoutine = async () => {
        setLoading(true);
        setError(null);

        try {
            const routineData = {
                user: userID,
                department: departmentid,
                semester,
                schedules: [
                    {
                        dayName: day,
                        timeSlots: [
                            {
                                paperCode,
                                professor, 
                                startTime: new Date(`2025-01-01 ${startTime}`),
                                endTime: new Date(`2025-01-01 ${endTime}`),
                            },
                        ],
                    },
                ],
            };

            const response = await axiosInstance.post("/routines", routineData);
            console.log("Routine Added:", response.data);

            setPaperCode("");
            setProfessor("");
            setClassType("");
            setSemester("");
            setDay("");
            setStartTime("");
            setEndTime("");

            onRoutineAdded();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add routine");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add routine
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Routine</DialogTitle>
                    <DialogDescription>
                        Fill in the routine details below.
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-red-500">{error}</p>}

                <div className="flex flex-col gap-4 py-4">
                    <Input
                        placeholder="Paper Code (e.g., CS101)"
                        value={paperCode}
                        onChange={(e) => setPaperCode(e.target.value)}
                    />
                    
                    <Select
                        value={professor}
                        onValueChange={(value) => setProfessor(value)}
                        disabled={fetchingFaculty}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={fetchingFaculty ? "Loading faculty..." : "Select Professor"} />
                        </SelectTrigger>
                        <SelectContent>
                            {facultyList.map((faculty) => (
                                <SelectItem key={faculty._id} value={faculty._id}>
                                    {faculty.name} ({faculty.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={semester}
                        onValueChange={(value) => setSemester(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="first">1st Semester</SelectItem>
                            <SelectItem value="second">2nd Semester</SelectItem>
                            <SelectItem value="third">3rd Semester</SelectItem>
                            <SelectItem value="fourth">4th Semester</SelectItem>
                            <SelectItem value="fifth">5th Semester</SelectItem>
                            <SelectItem value="sixth">6th Semester</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={day}
                        onValueChange={(value) => setDay(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Day" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monday">Monday</SelectItem>
                            <SelectItem value="tuesday">Tuesday</SelectItem>
                            <SelectItem value="wednesday">Wednesday</SelectItem>
                            <SelectItem value="thursday">Thursday</SelectItem>
                            <SelectItem value="friday">Friday</SelectItem>
                            <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="time"
                        placeholder="Start Time (e.g., 10:00)"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <Input
                        type="time"
                        placeholder="End Time (e.g., 11:00)"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />

                    <Button
                        onClick={handleAddRoutine}
                        className="w-full"
                        disabled={loading || !professor}
                    >
                        {loading ? "Saving..." : "Save Routine"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddRoutineDialog;