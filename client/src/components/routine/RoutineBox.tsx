import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useAuthStore } from "../../store/authStore";
import { toast } from "sonner";
import apiStore from "../../api/apiStore";

const RoutineBox = ({ sem, refreshKey }) => {
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const departmentid = useAuthStore((state) => state.departmentid);
    const role = useAuthStore((state) => state.role);

    useEffect(() => {
        const fetchRoutines = async () => {
            setLoading(true);
            setError(null);
            try { 
                const response = await axiosInstance.get(`/routines/department/${departmentid}`);
                console.log("Routine response=>",response);
                
                setRoutines(response.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch routines");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutines();
    }, [sem, refreshKey, departmentid]);

    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleDeleteRoutine = async (routineId) => {
        try {
            apiStore.routinesDelete(routineId)
            toast.success("Routine deleted successfully");
            if (refreshKey) await refreshKey();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete routine");
        }
    };

    if (loading) return <p>Loading routines...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <Tabs defaultValue="monday" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    {days.map((day) => (
                        <TabsTrigger key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <section className="p-4">
                    <h1>{sem.charAt(0).toUpperCase() + sem.slice(1)} Semester</h1>

                    {days.map((day) => (
                        <TabsContent key={day} value={day}>
                            <div className="space-y-4">
                                {routines
                                    ?.filter(routine => routine.semester === sem)
                                    ?.map((routine) => {
                                        const daySchedule = routine.schedules.find((s) => s.dayName === day);
                                        if (!daySchedule) return null;
                                        
                                        return daySchedule.timeSlots.map((slot, index) => (
                                            <Card key={`${routine._id}-${index}`}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span>{slot.paperCode}</span>
                                                            {role === "hod" && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => handleDeleteRoutine(routine._id)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">
                                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                                        </span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {slot.professor?.name || "Unknown Professor"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ));
                                    })}
                                {routines?.filter(routine => 
                                    routine.semester === sem && 
                                    !routine.schedules.some(s => s.dayName === day)
                                ).length === routines?.filter(r => r.semester === sem).length && (
                                    <p>No routines for {day.charAt(0).toUpperCase() + day.slice(1)}</p>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </section>
            </Tabs>
        </div>
    );
};

export default RoutineBox;