import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
    BellDot,
    CalendarRange,
    Clock,
    FilePenLine,
    Flashlight,
    Loader,
    MapPinned,
    Plus,
    Trash,
    Trash2,
    Users2,
    X,
} from "lucide-react";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Button } from "../ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import apiStore from "@/api/apiStore";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

interface Participant {
    _id: string;
    name: string;
    email?: string;
    phoneNo?: string;
    role?: string;
}

interface MeetingProps {
    meeting: {
        _id:string;
        title: string;
        description: string;
        meetingTime: string;
        meetingArea: string;
        joinusList: Participant[];
    };
    fetchMeetings: () => void; // 👈 Add this
}

interface NewUser {
    name: string;
    email: string;
    phoneNo?: string;
}
interface User {
    _id: string;
    name: string;
    email: string;
    phoneNo?: string;
    role?: string;
}

interface FormData {
    title: string;
    description: string;
    meetingTime: string;
    meetingArea: string;
    usersID: string[];
    users: NewUser[];
}

const PcMeeting: React.FC<MeetingProps> = ({ meeting ,fetchMeetings}) => {
    const [showParticipants, setShowParticipants] = useState(false);
    const [notifing,setNotifing]=useState(false)
    const meetingDateTime = new Date(meeting.meetingTime);
    const today = new Date();
 const [formData, setFormData] = useState<FormData>({
        title: meeting.title,
        description: meeting.description,
        meetingTime: meeting.meetingTime,
        meetingArea: meeting.meetingArea,
        // usersID: meeting.joinusList,
        usersID: meeting.joinusList.map((user) => user._id),
        users: [],
    });
    // Set both dates to midnight for accurate day comparison
    const meetingDay = new Date(meetingDateTime);
    meetingDay.setHours(0, 0, 0, 0);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [creating,setCreating]=useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };
    const fetchUsers = async () => {
        try {
            const response = await apiStore.getalluser(); // <-- This must exist in your API
            setAllUsers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };
        const [newUser, setNewUser] = useState<NewUser>({
            name: "",
            email: "",
            phoneNo: "",
        });
    
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    // Determine meeting status
    let meetingStatus = "";
    let statusColor = "";

    if (meetingDateTime < today) {
        meetingStatus = "Completed";
        statusColor = "bg-gray-500/10 text-gray-800 dark:text-gray-300";
    } else if (meetingDay.getTime() === todayMidnight.getTime()) {
        meetingStatus = "Today";
        statusColor = "bg-green-500/10 text-green-800 dark:text-green-300";
    } else {
        meetingStatus = "Upcoming";
        statusColor = "bg-blue-500/10 text-blue-800 dark:text-blue-300";
    }

    const deleteMeeting=async(meetingId:string)=>{
        try {
            await apiStore.deleteMeeting(meetingId)
            fetchMeetings();
        } catch (error:any) {
            
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true)
        try {
            const payload = { ...formData };
            console.log("Submitting Meeting:", payload);
            await apiStore.updateMeeting(meeting._id,payload);

            fetchMeetings()
        } catch (err) {
            console.error("Failed to create meeting", err);
        }finally{
            setCreating(false)
        }
    };

    const handleCheckboxChange = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            usersID: prev.usersID.includes(userId)
                ? prev.usersID.filter((id) => id !== userId)
                : [...prev.usersID, userId],
        }));
    };

    const handleAddNewUser = () => {
        if (!newUser.name || !newUser.email) return;

        setFormData((prev) => ({
            ...prev,
            users: [...prev.users, newUser],
        }));
        setNewUser({ name: "", email: "", phoneNo: "" });
    };

    const notifyMeeting=async( meetingId:string)=>{
        setNotifing(true)
        try {
            await apiStore.notifyMeeting(meetingId)
        } catch (error) {
            
        }finally{
            setNotifing(false)
        }
    }
    const formattedDate = meetingDateTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    const formattedTime = meetingDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                // whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full my-4"
            >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm py-2">
                    <CardHeader className="py-2 px-4 flex justify-between items-center">
                        <div className="py-2 px-4 flex gap-5">
                            <h2 className="text-xl font-semibold text-primary">
                                {meeting.title}
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`px-3 py-2 rounded-full text-xs font-medium ${statusColor}`}
                            >
                                {meetingStatus}
                            </motion.div>
                        </div>
                        <AuthenticateComponent roles={["hod"]}>
                            <div className="flex gap-3">
                           
                             
                            <Tooltip>
  <TooltipTrigger asChild>
  <Button disabled={notifing} onClick={()=>notifyMeeting(meeting._id)} className="dark:bg-[#0f172a] bg-blue-200  hover:bg-blue-400">
                                {!notifing?  <BellDot className="text-blue-700" /> :
                                    
                                    <Loader className="animate-spin text-blue-700" />
                              }
                                       </Button></TooltipTrigger>
  <TooltipContent >
    Notify pericipent
  </TooltipContent>
</Tooltip>
                           
                            
                  
                                <Tooltip>
                                    <Dialog>
                                        <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button onClick={fetchUsers} className="bg-blue-200 dark:bg-[#0f172a] hover:bg-blue-400">
                                            <FilePenLine className="text-blue-700" />
                                            </Button>
                                        </DialogTrigger>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                        <p>Edit this meeting</p>
                                        </TooltipContent>

                                        <DialogContent className="h-full overflow-y-auto">
                                        <DialogHeader className="flex flex-col gap-2">
                                            <DialogTitle>Edit Meeting</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">

                                            <form
                                                onSubmit={handleSubmit}
                                                className="space-y-4 sm:space-y-6 mt-4 w-full"
                                                >
                                                {/* Title */}
                                                <div className="space-y-2">
                                                    <Label>Meeting Title *</Label>
                                                    <Input name="title" value={formData.title} onChange={handleChange} required />
                                                </div>

                                                {/* Location */}
                                                <div className="space-y-2">
                                                    <Label>Location</Label>
                                                    <Input name="meetingArea" value={formData.meetingArea} onChange={handleChange} />
                                                </div>

                                                {/* Date & Participants */}
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                    <Label>Date & Time *</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        name="meetingTime"
                                                        value={formData.meetingTime.slice(0, 16)}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    </div>
                                                    <div className="space-y-2">
                                                    <Label>Participants</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                        <Button variant="outline" className="w-full justify-between">
                                                            {formData.usersID.length > 0
                                                            ? `${formData.usersID.length} user(s) selected`
                                                            : "Select participants"}
                                                            <span className="ml-2">▼</span>
                                                        </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-full sm:w-[300px] max-h-60 overflow-y-auto p-2">
                                                        {allUsers.map((user) => (
                                                            <div key={user._id} className="flex items-center gap-2 py-2">
                                                            <Checkbox
                                                                id={`user-${user._id}`}
                                                                checked={formData.usersID.includes(user._id)}
                                                                onCheckedChange={() => handleCheckboxChange(user._id)}
                                                            />
                                                            <Label htmlFor={`user-${user._id}`} className="text-sm sm:text-base">
                                                                {user.name}
                                                            </Label>
                                                            <span className="ml-auto text-xs text-gray-500">{user.role}</span>
                                                            </div>
                                                        ))}
                                                        </PopoverContent>
                                                    </Popover>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    className="min-h-[100px]"
                                                    />
                                                </div>

                                                {/* External Participant */}
                                                <div className="space-y-2">
                                                    <Label>Add External Participant</Label>
                                                    <div className="space-y-2">
                                                    <Input
                                                        name="name"
                                                        value={newUser.name}
                                                        onChange={handleNewUserChange}
                                                        placeholder="Name"
                                                    />
                                                    <Input
                                                        name="email"
                                                        value={newUser.email}
                                                        onChange={handleNewUserChange}
                                                        placeholder="Email"
                                                    />
                                                    <Input
                                                        name="phoneNo"
                                                        value={newUser.phoneNo}
                                                        onChange={handleNewUserChange}
                                                        placeholder="Phone"
                                                    />
                                                    </div>
                                                    {/* <div className="flex justify-end"> */}
                                                    <Button type="button" onClick={handleAddNewUser} className="w-full sm:w-auto">
                                                        <Plus className="mr-1" /> Add External Participant
                                                    </Button>
                                            {/* </div> */}

                                                </div>

                                                {/* Display Added External Users */}
                                                {formData.users.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                    <Label>External Participants Added:</Label>
                                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                                        {formData.users.map((user, index) => (
                                                        <li key={index} className="break-all">
                                                            {user.name} — {user.email}
                                                            {user.phoneNo && ` — ${user.phoneNo}`}
                                                        </li>
                                                        ))}
                                                    </ul>
                                                    </div>
                                                )}

                                                {/* Submit Button */}
                                                <DialogFooter className="pt-2 w-full ">
                                                    <Button type="submit" className="w-full sm:w-auto"  disabled={creating}>
                                                    Create Meeting 
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                            </DialogDescription>
                                        </DialogHeader>

                                        </DialogContent>
                                    </Dialog>
                                </Tooltip>

                                <Tooltip>
                                    <Dialog>
                                        <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button className="dark:bg-[#450a0a] bg-red-200 hover:bg-red-400">
                                            <Trash className="text-red-700" />
                                            </Button>
                                        </DialogTrigger>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                        <p>Delete this meeting</p>
                                        </TooltipContent>

                                        <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                            This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                                            <Button
                                                className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                onClick={() => deleteMeeting(meeting._id)}
                                            >
                                                <Trash2 />
                                            </Button>
                                            </DialogDescription>
                                        </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </Tooltip>

                            </div>
                        </AuthenticateComponent>
                    </CardHeader>

                    <CardContent className="space-y-2 py-2 px-4 pb-3">
                        <p className="text-muted-foreground text-sm">
                            {meeting.description}
                        </p>
                    </CardContent>

                    <CardFooter className="flex flex-wrap gap-3 justify-center sm:justify-between text-sm py-2 px-6 border-t">
                        <div className="flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1">
                            <CalendarRange className="w-4 h-4 text-primary" />
                            <span className="font-medium">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">{formattedTime}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-muted text-muted-foreground rounded-full px-3 py-1">
                            <MapPinned className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                                {meeting.meetingArea}
                            </span>
                        </div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => setShowParticipants(true)}
                                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 transition-colors text-muted-foreground rounded-full px-3 py-1"
                                >
                                    <Users2 className="w-4 h-4 text-primary" />
                                    <span className="font-medium">
                                        {meeting.joinusList.length} participants
                                    </span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View perticipent member</p>
                            </TooltipContent>
                        </Tooltip>
                    </CardFooter>
                </div>
            </motion.div>

            {/* Participants Popup */}
            <AnimatePresence>
                {showParticipants && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowParticipants(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center border-b p-4">
                                <h3 className="text-lg font-semibold">
                                    Meeting Participants
                                </h3>
                                <button
                                    onClick={() => setShowParticipants(false)}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 overflow-y-auto max-h-[60vh]">
                                <ul className="space-y-3">
                                    {meeting.joinusList.map((participant) => (
                                        <li
                                            key={participant._id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                        >
                                            <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">
                                                    {participant.name}
                                                </p>
                                                {participant.role && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                        {participant.role}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t p-4 flex justify-end">
                                <button
                                    onClick={() => setShowParticipants(false)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PcMeeting;
