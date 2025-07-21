import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
    BellDot,
    CalendarRange,
    Clock,
    FilePenLine,
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
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
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

interface Participant {
    _id: string;
    name: string;
    email?: string;
    phoneNo?: string;
    role?: string;
}
interface User {
    _id: string;
    name: string;
    email: string;
    phoneNo?: string;
    role?: string;
}

interface NewUser {
    name: string;
    email: string;
    phoneNo?: string;
}
interface FormData {
    title: string;
    description: string;
    meetingTime: string;
    meetingArea: string;
    usersID: string[];
    users: NewUser[];
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

const MobileMeeting: React.FC<MeetingProps> = ({  meeting ,fetchMeetings }) => {
    const [showParticipants, setShowParticipants] = useState(false);
 const [formData, setFormData] = useState<FormData>({
        title: meeting.title,
        description: meeting.description,
        meetingTime: meeting.meetingTime,
        meetingArea: meeting.meetingArea,
        // usersID: meeting.joinusList,
        usersID: meeting.joinusList.map((user) => user._id),
        users: [],
    });
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };
    const meetingDateTime = new Date(meeting.meetingTime);
    const today = new Date();
  const fetchUsers = async () => {
        try {
            const response = await apiStore.getalluser(); // <-- This must exist in your API
            setAllUsers(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [creating,setCreating]=useState(false)
    const meetingDay = new Date(meetingDateTime);
    meetingDay.setHours(0, 0, 0, 0);

        const [newUser, setNewUser] = useState<NewUser>({
            name: "",
            email: "",
            phoneNo: "",
        });
    
    const handleCheckboxChange = (userId: string) => {
        setFormData((prev) => ({
            ...prev,
            usersID: prev.usersID.includes(userId)
                ? prev.usersID.filter((id) => id !== userId)
                : [...prev.usersID, userId],
        }));
    };
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    let meetingStatus = "";
    let statusColor = "";
    const handleAddNewUser = () => {
        if (!newUser.name || !newUser.email) return;

        setFormData((prev) => ({
            ...prev,
            users: [...prev.users, newUser],
        }));
        setNewUser({ name: "", email: "", phoneNo: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true)
        try {
            const payload = { ...formData };
            console.log("Submitting Meeting:", payload);
            await apiStore.updateMeeting(meeting._id,payload);
            // setFormData({
            //     title: "",
            //     description: "",
            //     meetingTime: "",
            //     meetingArea: "",
            //     usersID: [],
            //     users: [],
            // });
        } catch (err) {
            console.error("Failed to create meeting", err);
        }finally{
            setCreating(false)
            fetchMeetings()
        }
    };
    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev, [name]: value }));
    };
    const [notifing,setNotifing]=useState(false)
    const deleteMeeting=async(meetingId:string)=>{
        try {
            await apiStore.deleteMeeting(meetingId)
            fetchMeetings();
        } catch (error:any) {
            
        }
    }
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

    const formattedDate = meetingDateTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
 const notifyMeeting=async( meetingId:string)=>{
        setNotifing(true)
        try {
            await apiStore.notifyMeeting(meetingId)
        } catch (error) {
            
        }finally{
            setNotifing(false)
        }
    }
    const formattedTime = meetingDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <>
            <motion.div
                // whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full my-3 px-4 "
            >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm py-2 ">
                    {/* Header - Stacked vertically */}
                    <CardHeader className="py-2 px-3">
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                            {/* Left: Title and status */}
                            <div className="flex flex-row max-w-[calc(100%-150px)]">
                                <h2 className="text-lg font-semibold text-primary line-clamp-2 pr-2">
                                    {meeting.title}
                                </h2>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor} mt-1 w-fit`}
                                >
                                    {meetingStatus}
                                </motion.div>
                            </div>

                            {/* Right: Dialog buttons */}
                            <AuthenticateComponent roles={["hod"]}>
                                <div className="flex gap-1 shrink-0">
                                    {/* Send Mail Dialog */}
                                    <Button disabled={notifing} onClick={()=>notifyMeeting(meeting._id)} 
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50">
                                {!notifing?  <BellDot className="text-blue-700" /> :
                                    
                                    <Loader className="animate-spin text-blue-700" />
                              }
                                       </Button>

                                    {/* Edit Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                             onClick={fetchUsers} 
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                            >
                                                <FilePenLine className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>

                                                                                        <DialogTitle>Edit Meeting</DialogTitle>
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
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete Dialog */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50"
                                            >
                                                <Trash className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader className="flex flex-col gap-2">
                                                <DialogTitle>
                                                    Are you absolutely sure?
                                                </DialogTitle>
                                                <DialogDescription className="flex flex-col gap-2">
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete meeting
                                                    and remove your data from
                                                    our servers.
                                                    <Button 
                                                onClick={() => deleteMeeting(meeting._id)} className=" w-full rounded-lg bg-red-500 hover:bg-red-800">
                                                        <Trash2 />
                                                    </Button>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </AuthenticateComponent>
                        </div>
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="space-y-2 py-1 px-3 pb-2">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                            {meeting.description}
                        </p>
                    </CardContent>

                    {/* Footer - Grid layout */}
                    <CardFooter className="grid grid-cols-2 gap-2 text-sm py-2 px-3 border-t">
                        <div className="flex items-center gap-2 bg-muted dark:bg-card-foreground text-muted-foreground rounded-full px-2.5 py-1 text-xs">
                            <CalendarRange className="w-3.5 h-3.5 text-primary" />
                            <span>{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-muted  dark:bg-card-foreground  text-muted-foreground rounded-full px-2.5 py-1 text-xs">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{formattedTime}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-muted  dark:bg-card-foreground text-muted-foreground rounded-full px-2.5 py-1 text-xs span-2">
                            <MapPinned className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate">
                                {meeting.meetingArea}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowParticipants(true)}
                            className="flex items-center gap-2 bg-muted  dark:bg-card-foreground hover:bg-muted/80 transition-colors text-muted-foreground rounded-full px-2.5 py-1 text-xs justify-center"
                        >
                            <Users2 className="w-3.5 h-3.5 text-primary" />
                            <span>
                                {meeting.joinusList.length} participant
                                {meeting.joinusList.length !== 1 ? "s" : ""}
                            </span>
                        </button>
                    </CardFooter>
                </div>
            </motion.div>

            {/* Mobile-optimized Participants Popup */}
            <AnimatePresence>
                {showParticipants && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col p-0 sm:p-4"
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30 }}
                            className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl mt-auto w-full h-[90vh] flex flex-col"
                        >
                            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <h3 className="text-lg font-semibold">
                                    Participants
                                </h3>
                                <button
                                    onClick={() => setShowParticipants(false)}
                                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 overflow-y-auto flex-grow">
                                {meeting.joinusList.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No participants yet
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {meeting.joinusList.map(
                                            (participant) => (
                                                <li
                                                    key={participant._id}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                                >
                                                    <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl w-9 h-9 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">
                                                            {participant.name}
                                                        </p>
                                                        {participant.role && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                                                {
                                                                    participant.role
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>

                            <div className="p-4 border-t pb-16">
                                <Button
                                    onClick={() => setShowParticipants(false)}
                                    className="w-full"
                                >
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MobileMeeting;
