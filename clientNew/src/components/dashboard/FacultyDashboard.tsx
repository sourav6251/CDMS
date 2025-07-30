
import apiStore from "@/api/apiStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
const FacultyDashboard = () => {
  const [schedule, setSchedule] = useState([]);
   const getUserScheduleForToday = async () => {
      try {
        const response = await apiStore.getUserScheduleForToday();
        setSchedule(response?.data.data); // assuming `response.data` contains the array
      } catch (error: any) {
        console.error("Failed to fetch schedule:", error);
      }
    };
    const formatTo12Hour = (time: string) => {
      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    };
    
    useEffect(() => {
      getUserScheduleForToday();
    }, []);
  
  return (
    <div className="w-full px-6 py-4 space-y-6">
      <h2 className="text-xl font-semibold  text-center mb-5 text-green-700">
  📚 Another day,  Here's what your classroom journey looks like today.
</h2>
 {/* Routine Table */}
    {schedule.length > 0 && (
      <div className="border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semester</TableHead>
              <TableHead>Paper Code</TableHead>
              <TableHead>Paper Name</TableHead>
              <TableHead>Room No</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item:any, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.semester}</TableCell>
                <TableCell>{item.paperCode}</TableCell>
                <TableCell>{item.paperName}</TableCell>
                <TableCell>{item.roomNo}</TableCell>
                <TableCell>{formatTo12Hour(item.startTime)}</TableCell>
                <TableCell>{formatTo12Hour(item.endTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}</div>
  )
}

export default FacultyDashboard