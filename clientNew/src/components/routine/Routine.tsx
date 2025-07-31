import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {  Loader, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiStore from "@/api/apiStore";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface Professor {
  _id: string;
  name: string;
  email: string;
}

interface TimeSlot {
  _id: string;
  paperCode: string;
  paperName: string;
  roomNo:string;
  startTime: string;
  endTime: string;
  professorModel: "user" | "normaluser";
  professor: Professor | string;
}

interface Schedule {
  dayName: string;
  timeSlots: TimeSlot[];
}

interface Routine {
  _id: string;
  schedules: Schedule[];
  semester: string;
}

interface Props {
  routines: Routine[];
  
  fetchRoutine: (sem: string) => void;
}

const Routine: React.FC<Props> = ({ routines,fetchRoutine }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
const [deleting,setDeleting]=useState(false)
  const selectedRoutine = routines[0];

  if (!selectedRoutine) {
    return <p className="text-center">No routine found</p>;
  }
  const onDelete=async(routineId:string, timeSlotId:string)=>{
    setDeleting(true)
    console.log("onDelete=>",routineId,"  ",timeSlotId);
    try {
      await apiStore.deleteRoutine(routineId,timeSlotId)
      fetchRoutine(selectedRoutine.semester)
    } catch (error:any) {
      
    }finally{
      setDeleting(false)
    }
    
  }

  return (
    <div className="w-full mt-6 px-2 sm:px-4">
      <Tabs defaultValue="monday" className="w-full">
        {/* Tabs List */}
        <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-400">
          <TabsList className="inline-flex gap-2 min-w-max px-2 w-full">
            {days.map((day) => (
              <TabsTrigger
                key={day}
                value={day.toLowerCase()}
                className="min-w-[90px] text-sm sm:text-base"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tabs Content */}
        {days.map((day) => {
          const schedule = selectedRoutine.schedules.find(
            (s) => s.dayName.toLowerCase() === day.toLowerCase()
          );

          return (
            <TabsContent
              key={day}
              value={day.toLowerCase()}
              className="w-full mt-4"
            >
              {schedule ? (
                <div className="space-y-6">
                  {schedule?.timeSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className="rounded-xl border shadow-sm p-4 sm:p-5 transition hover:shadow-md relative"
                    >
                      <AuthenticateComponent roles={["hod"]}>
                      {/* 🗑️ Delete Button */}
                      {deleting?<Loader className="animate-spin" />:<>
                      <Dialog>
                      <DialogTrigger asChild><Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 hover:text-red-500"
                        // onClick={() => onDelete(selectedRoutine._id,slot._id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button></DialogTrigger>
                       <DialogContent>
                          <DialogHeader className="flex flex-col gap-2">
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription className="flex flex-col gap-2">
                          This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                          <Button
                            className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                              onClick={() => onDelete(selectedRoutine._id,slot._id)}
                          >
                          <Trash2 />
                          </Button>
                        </DialogDescription>
                        </DialogHeader>
                        </DialogContent>
        
                      </Dialog></> }
                     
                      </AuthenticateComponent>
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-semibold">
                          
                          <div className="text-sm sm:text-base space-y-1  ">
                            <div className="flex flex-wrap gap-x-4 gap-y-1 pb-3 ">
                              <span className="font-medium rounded-3xl px-3">
                                Paper Code: <span className="font-bold text-gray-700 ">{slot.paperCode}</span>
                              </span>
                              <span className="font-medium  rounded-3xl px-3">
                                Paper Name: <span className="font-bold text-gray-700">{slot.paperName}</span>
                              </span>
                              <span className="font-medium  rounded-3xl px-3">
                                Room No: <span className="font-bold text-gray-700">{slot.roomNo}</span>
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm">
                            
                          </div>
                          </div>

                            </h3>
                          <p className="text-sm">
                            <span className="font-medium">Professor: </span>
                            <span className="font-bold text-lg">
                            {typeof slot.professor === "object" &&
                            slot.professor !== null
                              ? `${slot.professor.name} `
                              : `${slot.professor} `} 
                              </span>
                          </p>
                          
                        </div>

                        {/* Time Info */}
                        <div className="flex flex-col  sm:items-center gap-1 sm:gap-6 text-sm pr-10">
                          <div>
                            <span className="font-medium">Start:</span>{" "}
                            {formatTime(slot.startTime)}
                          </div>
                          <div>
                            <span className="font-medium">End:</span>{" "}
                            {formatTime(slot.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No routine for {day}</p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Routine;
