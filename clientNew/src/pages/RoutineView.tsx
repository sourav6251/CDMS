import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IsMobile } from "@/components/hook/IsMobile";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Plus } from "lucide-react";
import apiStore from "@/api/apiStore";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import Routine from "@/components/routine/Routine";

const RoutineView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    const [open, setOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState("1");
    const [users, setUsers] = useState<
        { _id: string; name: string; email: string; role?: string }[]
    >([]);
    const [manualEntry, setManualEntry] = useState(false);
const [routine,setRoutine]=useState([])
const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            semester: "",
            paperCode: "",
            paperName: "",
            professorName: "",
            professorID: "",
            startTime: "",
            endTime: "",
            dayName: "",
        },
    });

    const handleRoutineSubmit = async (data: any) => {
        try {
            console.log("Submitted Routine:", data);
            await apiStore.addRoutine(data);
            setOpen(false);
            reset();
        } catch (error) {
            console.error("Routine creation error:", error);
        }
    };

    const getAllUser = async () => {
        try {
            const response = await apiStore.getalluser();
            setUsers(response?.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        if (open) getAllUser();
    }, [open]);

    useEffect(() => {
        setValue("semester", selectedSemester);
    }, [selectedSemester, setValue]);
    useEffect(() => {
        fetchRoutine(selectedSemester)

    }, [selectedSemester]);

    const fetchRoutine=async(sem:string)=>{

        setLoading(true);
        try {
          const response=  await apiStore.showRoutine(sem)
          console.log("response=>",response);
          
          setRoutine(response.data.data)
        } catch (error:any) {
            
        }finally{

        setLoading(false);
        }
    }
    return (
        <>
            {/* Top Controls */}
            <div className="fixed top-12 right-10 z-[9999] flex h-10 gap-2">
                <div></div>
                <Select onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-[150px] bg-slate-200">
                        <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {["1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
                            <SelectItem key={sem} value={sem}>
                                {sem} semester
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Add Routine Button */}
                <AuthenticateComponent roles={["hod"]}>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 px-2 hover:bg-blue-900">
                                <Plus className="mr-1" /> Add
                            </Button>
                        </DialogTrigger>

                        {/* Dialog Content */}
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create Routine Entry</DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={handleSubmit(handleRoutineSubmit)}
                                className="space-y-4"
                            >
                                <div className="flex w-full gap-3">
                                {/* Semester Selector */}
                                <div  className="w-full">
                                    <label className="block text-sm font-medium mb-1">Semester</label>
                                    <Select onValueChange={(value) => setValue("semester", value)}>
                                        <SelectTrigger className="w-full border bg-white p-2 rounded">
                                            <SelectValue placeholder="Select semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["1", "2", "3", "4", "5", "6", "7", "8"].map((sem) => (
                                                <SelectItem key={sem} value={sem}>
                                                    {sem} semester
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.semester && (
                                        <p className="text-red-500 text-sm">Semester is required</p>
                                    )}
                                </div>
                                {/* Day Selector */}
                                <div className="w-full">
                                    <label className="block text-sm font-medium mb-1">
                                        Day
                                    </label>
                                    <Select onValueChange={(v) => setValue("dayName", v)}>
                                        <SelectTrigger className="w-full border bg-white p-2 rounded">
                                            <SelectValue placeholder="Select day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                                <SelectItem key={day} value={day}>
                                                    {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.dayName && (
                                        <p className="text-red-500 text-sm">Day is required</p>
                                    )}
                                </div>
                                </div>

                                <div className="flex w-full gap-3">
                                {/* Paper Code */}
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Paper Code"
                                        {...register("paperCode", {
                                            required: true,
                                        })}
                                        className="w-full border p-2 rounded"
                                    />
                                    {errors.paperCode && (
                                        <p className="text-red-500 text-sm">
                                            Paper code is required
                                        </p>
                                    )}
                                </div>

                                {/* Paper Name */}
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Paper Name"
                                        {...register("paperName")}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                                </div>
                                {/* Professor Selection */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Professor
                                    </label>
                                    <div className="flex items-center gap-2 my-2">
                                        <input
                                            type="checkbox"
                                            id="manualEntry"
                                            checked={manualEntry}
                                            onChange={() => {
                                                setManualEntry(!manualEntry);
                                                setValue("professorID", "");
                                                setValue("professorName", "");
                                            }}
                                        />
                                        <label htmlFor="manualEntry">
                                            Enter professor manually
                                        </label>
                                    </div>

                                    {!manualEntry ? (
                                        <Select
                                            onValueChange={(value) => {
                                                setValue("professorID", value);
                                                const selected = users.find((u) => u._id === value);
                                                if (selected) {
                                                    setValue("professorName", selected.name);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full border bg-white p-2 rounded">
                                                <SelectValue placeholder="Choose a professor" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px] overflow-y-auto">
                                                {users.map((user) => (
                                                    <SelectItem key={user._id} value={user._id}>
                                                        {user.name} ({user.email})
                                                        {user.role ? ` - ${user.role}` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder="Enter professor name"
                                            {...register("professorName", { required: true })}
                                            className="w-full border p-2 rounded"
                                            onChange={(e) => {
                                                setValue("professorID", "");
                                                setValue("professorName", e.target.value);
                                            }}
                                        />
                                    )}
                                </div>

                              
                                {/* Time Pickers */}
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-sm font-medium">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            {...register("startTime", {
                                                required: true,
                                            })}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-sm font-medium">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            {...register("endTime", {
                                                required: true,
                                            })}
                                            className="w-full border p-2 rounded"
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-4">
                                    <Button type="submit" className="w-full">
                                        Submit Routine
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </AuthenticateComponent>
            </div>



            <div className="flex w-full flex-col items-center justify-center px-4">
            {loading ? (
                <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
            </div>
            ) : (
                <Routine routines={routine} />
            )}
            </div>

        </>
    );
};

export default RoutineView;
