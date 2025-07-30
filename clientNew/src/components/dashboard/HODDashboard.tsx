import apiStore from "@/api/apiStore";
import {
  FileTextIcon,
  UserCheck,
  CalendarClock,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HODDashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [pendingNo,setpendingNo]=useState("")
  const [memberRequest,setMemberRequest]=useState("")
  const [upcommingMeetings,setUpcommingMeetings]=useState("")

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
  const pendingCertificateRequest=async()=>{
    try {
     const response= await apiStore.pendingCertificateRequest()
      setpendingNo(response.data.data)
    } catch (error:any) {
      
    }
  }
  const getAllRegisterRequestUser=async()=>{
    try {
     const response= await apiStore.getAllRegisterRequestUser()
     setMemberRequest(response.data.data.length)
    } catch (error:any) {
      
    }
  }
  const upcommingMeeting=async()=>{
    try {
     const response= await apiStore.upcommingMeeting()
     setUpcommingMeetings(response.data.data)
    } catch (error:any) {
      
    }
  }
  
  useEffect(() => {
    getUserScheduleForToday();
    pendingCertificateRequest();
    getAllRegisterRequestUser();
    upcommingMeeting();

  }, []);

  const cards = [
    {
      title: "Certificate Requests",
      icon: pendingNo? pendingNo:<FileTextIcon className="w-8 h-8 text-[#0066ff]" />,
      bg: "bg-[#79afe9]",
    },
    {
      title: "Member's Request",
      icon:memberRequest?memberRequest: <UserCheck className="w-8 h-8 text-[#33d383]" />,
      bg: "bg-[#33d383]",
    },
    {
      title: "Upcoming Meetings",
      icon: upcommingMeetings?upcommingMeetings:<CalendarClock className="w-8 h-8 text-[#98ce6b]" />,
      bg: "bg-[#98ce6b]",
    },
  ];

  return (
    <div className="w-full px-6 py-4 space-y-6">
      {/* Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bg} h-28 rounded-xl shadow-lg flex items-center gap-4 px-5 hover:scale-[1.02] transition-transform`}
          >

      <div className="h-14 w-14 text-center text-4xl font-bold  pr-1 p-2 bg-white bg-opacity-20 rounded-full">
       {card.icon}
            </div>
            <div className="text-lg font-semibold">{card.title}</div>
          </div>
        ))}
      </div>

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
      )}
    </div>
  );
};

export default HODDashboard;
