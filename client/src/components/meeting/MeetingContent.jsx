import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    Trash2,
    FilePenLine,
    Mail,
} from "lucide-react";
import { parse, isToday, isFuture } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import apiStore from "../../api/apiStore";

const MeetingContent = ({
    id,
    title,
    description,
    date_time, 
    participantsNo,
    participants,
    location,
    onDelete,
}) => {
    console.log("date_time=> ", date_time);

    const parsedDateTime = new Date(date_time);
    const date = parsedDateTime
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .split("/")
        .join("-"); 
    const time = parsedDateTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }); 
    const initialDatetime = () => {
        try {
            return parsedDateTime.toISOString().slice(0, 16); 
        } catch {
            return "";
        }
    };

    const [meetingData, setMeetingData] = useState({
        title,
        description,
        datetime: initialDatetime(),
        location,
    });
    const parseDate = (dateStr) => parse(dateStr, "dd-MM-yyyy", new Date());

    let status;
    let background;
    const meetingDate = parseDate(date);
    if (isToday(meetingDate)) {
        status = "Today";
        background = "bg-[#35c735]";
    } else if (isFuture(meetingDate)) {
        status = "Upcoming";
        background = "bg-[#1e87b8]";
    } else {
        status = "Completed";
        background = "bg-[#838586]";
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setMeetingData((prev) => ({ ...prev, [id]: value }));
    };
    const submitEdit = async (e) => {
        e.preventDefault();
        const data = {
            title: meetingData.title,
            description: meetingData.description,
            meetingTime: new Date(meetingData.datetime).toISOString(), 
            mettingArea: meetingData.location, 
        };

        try {
            console.log("Sending edit data:", data);
            await apiStore.meetingEdit(id,data)
            toast.success("Meeting updated successfully!");
        } catch (error) {
            console.error(
                "submitEdit error:",
                error.response?.data || error.message
            );
            toast.error(
                "Failed to update meeting: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };
    const notify = async () => {
        let subject = `Reminder: ${title} scheduled on ${date} at ${time}`;
        console.log("participants=> ", participants);
        try {
            await apiStore.meetingMail(participants, title, subject);
            toast.success("mail send Successfully")
        } catch (error) {
            toast.error("Something Wrong")
            console.error(error)

        }
    };

    const handleDelete = async () => {
        try {
            await apiStore.meetingDelete(id)
            toast.success("Meeting deleted successfully!");
            onDelete();
        } catch (error) {
            console.error(
                "handleDelete error:",
                error.response?.data || error.message
            );
            toast.error(
                "Failed to delete meeting: " +
                    (error.response?.data?.message || error.message)
            );
        }
    };

    return (
        <Card className="my-4 shadow-lg border border-gray-200 rounded-2xl transition hover:shadow-xl">
            <CardHeader className="rounded-t-2xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex">
                        <CardTitle className="text-xl text-blue-800 flex flex-row">
                            <div className="w-full flex flex-row gap-4">
                                <div
                                    className={`px-2 rounded-full text-white text-[12px] font-normal shadow-sm ${background} flex items-center justify-center`}
                                >
                                    {status}
                                </div>
                                <div className="justify-center items-center">
                                    {title}
                                </div>
                            </div>
                        </CardTitle>
                    </div>
                    <div className="flex w-fit gap-3">
                        <Dialog>
                            <DialogTrigger className="justify-around items-center px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-700 transition flex gap-2">
                                Delete
                                <Trash2 className="p-1" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Meeting</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this
                                        meeting? This action cannot be undone.
                                        <Button
                                            onClick={handleDelete}
                                            className="mt-4 bg-red-500 text-white"
                                        >
                                            Confirm Delete
                                        </Button>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger className="justify-around items-center px-4 py-2 text-sm bg-[#28449ede] text-white rounded-md hover:bg-[#28439e] transition flex gap-2">
                                Edit <FilePenLine className="p-1" />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Meeting</DialogTitle>
                                    <DialogDescription>
                                        <form
                                            onSubmit={submitEdit}
                                            className="space-y-6 p-6 bg-white max-w-xl mx-auto"
                                        >
                                            <div className="flex flex-col gap-1.5">
                                                <Label htmlFor="title">
                                                    Title
                                                </Label>
                                                <Input
                                                    id="title"
                                                    value={meetingData.title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter meeting title"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    id="description"
                                                    value={
                                                        meetingData.description
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder="Meeting purpose, agenda..."
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <Label htmlFor="datetime">
                                                    Date and Time
                                                </Label>
                                                <Input
                                                    id="datetime"
                                                    type="datetime-local"
                                                    value={meetingData.datetime}
                                                    onChange={handleInputChange}
                                                    className="w-full"
                                                    required
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <Label htmlFor="location">
                                                    Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    value={meetingData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter room/building"
                                                    required
                                                />
                                            </div>

                                            <Button type="submit">Save</Button>
                                        </form>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Button onClick={() => notify()}>Notify <Mail/></Button>

                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {description}
            </CardContent>

            <CardFooter className="flex justify-around px-6 py-[10px] rounded-b-2xl">
                <div className="flex flex-col items-center gap-[3px]">
                    <Calendar className="w-4 h-4" />
                    <div className="flex gap-2 items-center">
                        <p className="text-[13px]">Date</p>
                        <p className="text-[13px]">{date}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-[3px]">
                    <Clock className="w-4 h-4" />
                    <div className="flex gap-2 items-center">
                        <p className="text-[13px]">Time</p>
                        <p className="text-[13px]">{time}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-[3px]">
                    <Users className="w-4 h-4" />
                    <div className="flex gap-2 items-center">
                        <p className="text-[13px]">participantsNo</p>
                        <p className="text-[13px]">{participantsNo}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-[3px]">
                    <MapPin className="w-4 h-4" />
                    <div className="flex gap-2 items-center">
                        <p className="text-[13px]">Location</p>
                        <p className="text-[13px]">{location}</p>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default MeetingContent;
