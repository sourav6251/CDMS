
import React, { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import RoutineBox from "../components/routine/RoutineBox";
import AddRoutineDialog from "../components/routine/AddroutineDialogue";
import { useAuthStore } from "../store/authStore";

const Routines = () => {
    const [semester, setSemester] = useState("first");
    const [refreshKey, setRefreshKey] = useState(0);
const role=useAuthStore((state)=>state.role)
    const handleRoutineAdded = () => {
        setRefreshKey((prev) => prev + 1); 
    };

    return (
        <section className="container flex flex-col gap-4">
            <header className="flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Routines</h1>
                    <p>Department</p>
                </div>
                <div className="flex flex-row gap-3 items-center justify-center">
                    <Select
                        value={semester}
                        onValueChange={(value) => setSemester(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="first">1st Sem</SelectItem>
                            <SelectItem value="second">2nd Sem</SelectItem>
                            <SelectItem value="third">3rd Sem</SelectItem>
                            <SelectItem value="fourth">4th Sem</SelectItem>
                            <SelectItem value="fifth">5th Sem</SelectItem>
                            <SelectItem value="sixth">6th Sem</SelectItem>
                            <SelectItem value="seventh">7th Sem</SelectItem>
                            <SelectItem value="eighth">8th Sem</SelectItem>
                        </SelectContent>
                    </Select>
                    {(role ==='hod') && 
                    <AddRoutineDialog onRoutineAdded={handleRoutineAdded} />
                }
                </div>
            </header>
           
            <div>
                <RoutineBox sem={semester} refreshKey={refreshKey} />
            </div>  
        </section>
    );
};

export default Routines;