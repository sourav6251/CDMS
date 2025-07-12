import { motion } from "framer-motion";
import {  Users2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axiosInstance from "../../api/axiosInstance";
import { useMemo } from "react";

export function DashboardContext() {
    const [routineData, setRoutineData] = useState([]);
    const { user } = useAuthStore(); 
    const [loading, setLoading] = useState(true);
    const MotionRow = motion(TableRow);
    const [meetings, setMeetings] = useState([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const res = await axiosInstance.get(`/meeting/email/${user.email}`);
                if (res.data.success) {
                    setMeetings(res.data.data); 
                }
            } catch (err) {
                console.error("Error fetching meetings", err);
            }
        };
    
        if (user?.email) fetchMeetings();
    }, [user?.email]);
    const upcomingMeetings = useMemo(() => {
        const now = new Date();
        return meetings.filter(meeting => new Date(meeting.mettingTime) >= now);
    }, [meetings]);
    
    
    useEffect(() => {
        const fetchTodayRoutine = async () => {
            try {
                const response = await axiosInstance.get(`/routines/${user._id}`);
                console.log("API Response:", response.data);
                
                const result = response.data;
    
                if (result.success && result.data.length > 0) {
                    const todayName = new Date().toLocaleDateString('en-US', { 
                        weekday: 'long' 
                    }).toLowerCase();
                    console.log("todayName=>",todayName);
                    
                    const routine = result.data[0];
                    console.log("routine=>",routine.schedules);
                    
                    const todaySchedule = routine.schedules.find(
                        schedule => schedule.dayName === todayName
                    );
    
                    console.log("Today's Schedule:", todaySchedule);
    
                    if (todaySchedule) {

                        const formattedSlots = todaySchedule.timeSlots.map(slot => ({
                            startTime: new Date(slot.startTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            endTime: new Date(slot.endTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            semester: routine.semester,
                            paperCode: slot.paperCode,
                            professor: slot.professor?.name || 'TBA'
                        }));
                        setRoutineData(formattedSlots);
                    } else {
                        setRoutineData([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching routine:", error);
            } finally {
                setLoading(false);
            }
        };
    
        if (user?._id) fetchTodayRoutine();
    }, []);



    return (
        <>
            <div className="h-full w-full bg-[#d3cbcb27] rounded-lg p-2 flex flex-col">
                <div className="flex w-full h-fit">

                  <Card
    icon={Users2}
    cardData={upcomingMeetings.length}
    cardName="Upcoming Meetings"
    className="bg-[#d3cbcb49] h-[7rem] w-full m-5 flex flex-col items-center justify-center rounded-lg"
/>

                </div>
                <div className="self-start pl-6 text-2xl pb-5 flex flex-col w-full mt-12">
                    <span className="text-[#213e75]  font-bold">
                        Today's teaching schedule
                    </span>
                    <Table>
                        <TableCaption>
                            A list of your Today's teaching schedules.
                        </TableCaption>
                        <TableHeader>
  <TableRow>
    <TableHead>Starting Time</TableHead>
    <TableHead>Ending Time</TableHead>
    <TableHead>Semester</TableHead>
    <TableHead className="text-right">Paper Code</TableHead>
  </TableRow>
</TableHeader>

<TableBody>
  {routineData.map((item, index) => (
    <MotionRow
      key={index}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        delay: index * 0.1,
      }}
      className="w-full"
    >
      <TableCell className="font-medium">{item.startTime}</TableCell>
      <TableCell>{item.endTime}</TableCell>
      <TableCell>{item.semester}</TableCell>
      <TableCell className="text-right">{item.paperCode}</TableCell>
    </MotionRow>
  ))}
</TableBody>

                    </Table>
                </div>
            </div>
        </>
    );
}

function Card({ icon: Icon, cardName, cardData, className }) {
    return (
        <div className={`${className} `}>
            <div className="h-12 w-12 bg-[#89da1f75] rounded-[50%]  p-3">
                <Icon className="h-full w-full text-[#7ac21c]" />
            </div>
            <span>{cardData}</span>
            <span>{cardName}</span>
        </div>
    );
}
