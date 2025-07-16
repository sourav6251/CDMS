import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
    BellDot,
    CalendarRange,
    Clock,
    FilePenLine,
    MapPinned,
    Trash,
    Trash2,
    Users2,
    X,
} from "lucide-react";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Button } from "../ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Participant {
    _id: string;
    name: string;
    email?: string;
    phoneNo?: string;
    role?: string;
}

interface MeetingProps {
    meeting: {
        title: string;
        description: string;
        meetingTime: string;
        meetingArea: string;
        joinusList: Participant[];
    };
}

const MobileMeeting: React.FC<MeetingProps> = ({ meeting }) => {
    const [showParticipants, setShowParticipants] = useState(false);

    const meetingDateTime = new Date(meeting.meetingTime);
    const today = new Date();

    const meetingDay = new Date(meetingDateTime);
    meetingDay.setHours(0, 0, 0, 0);

    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

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
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full my-3"
            >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm py-2">
                    {/* Header - Stacked vertically */}
                    <CardHeader className="py-2 px-3 flex flex-col gap-3">
                        <div className="flex justify-between items-start w-full">
                            <h2 className="text-lg font-semibold text-primary line-clamp-2 pr-2">
                                {meeting.title}
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor} flex-shrink-0`}
                            >
                                {meetingStatus}
                            </motion.div>
                        </div>

                        {/* Action buttons - Horizontal scroll */}
                        <AuthenticateComponent roles={["hod"]}>
                            <div className="flex gap-2 overflow-x-auto pb-1 w-full hide-scrollbar">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            //   size="iconSm"
                                            className="bg-blue-200  dark:bg-[#0f172a] hover:bg-blue-400 flex-shrink-0"
                                        >
                                            <BellDot className="text-blue-700 w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    {/* Dialog content remains same */}
                                    <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                            <DialogTitle>
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                                This action cannot be undone.
                                                This will permanently delete
                                                meeting and remove your data
                                                from our servers.
                                                <Button className=" w-full rounded-lg bg-red-500 hover:bg-red-800">
                                                    <Trash2 />
                                                </Button>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            //   size="iconSm"
                                            className="bg-blue-200 dark:bg-[#0f172a] hover:bg-blue-400 flex-shrink-0"
                                        >
                                            <FilePenLine className="text-blue-700 w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    {/* Dialog content remains same */}
                                    <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                            <DialogTitle>
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                                This action cannot be undone.
                                                This will permanently delete
                                                meeting and remove your data
                                                from our servers.
                                                <Button className=" w-full rounded-lg bg-red-500 hover:bg-red-800">
                                                    <Trash2 />
                                                </Button>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            //   size="iconSm"
                                            className="bg-red-200 dark:bg-[#450a0a] hover:bg-red-400 flex-shrink-0"
                                        >
                                            <Trash className="text-red-700 w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    {/* Dialog content remains same */}
                                    <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                            <DialogTitle>
                                                Are you absolutely sure?
                                            </DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                                This action cannot be undone.
                                                This will permanently delete
                                                meeting and remove your data
                                                from our servers.
                                                <Button className=" w-full rounded-lg bg-red-500 hover:bg-red-800">
                                                    <Trash2 />
                                                </Button>
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </AuthenticateComponent>
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

                        <div className="flex items-center gap-2 bg-muted  dark:bg-card-foreground text-muted-foreground rounded-full px-2.5 py-1 text-xs col-span-2">
                            <MapPinned className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate">
                                {meeting.meetingArea}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowParticipants(true)}
                            className="flex items-center gap-2 bg-muted  dark:bg-card-foreground hover:bg-muted/80 transition-colors text-muted-foreground rounded-full px-2.5 py-1 text-xs col-span-2 justify-center"
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
