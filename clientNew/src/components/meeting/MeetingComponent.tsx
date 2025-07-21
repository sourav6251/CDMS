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
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-desktop";
// import { useMediaQuery } from "@/hooks/use-media-query";

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

const MeetingComponent: React.FC<MeetingProps> = ({ meeting }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [showParticipants, setShowParticipants] = useState(false);

    const meetingDateTime = new Date(meeting.meetingTime);
    const today = new Date();

    // Set both dates to midnight for accurate day comparison
    const meetingDay = new Date(meetingDateTime);
    meetingDay.setHours(0, 0, 0, 0);

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

    const formattedDate = meetingDateTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

    const formattedTime = meetingDateTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Common action buttons
    const ActionButtons = () => (
        <AuthenticateComponent roles={["hod"]}>
            <div className={`flex gap-2 ${isDesktop ? "" : " pb-1 w-full hide-scrollbar"}`}>
                <Dialog>
                    <DialogTrigger asChild>
                        {isDesktop ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="dark:bg-[#0f172a] bg-blue-200 hover:bg-blue-400">
                                        <BellDot className="text-blue-700" size={isDesktop ? 16 : 14} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Send mail to participant members</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button className="bg-blue-200 dark:bg-[#0f172a] hover:bg-blue-400 flex-shrink-0">
                                <BellDot className="text-blue-700" size={14} />
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="flex flex-col gap-2">
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="flex flex-col gap-2">
                                This action cannot be undone. This will permanently delete meeting and remove your data from our servers.
                                <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                                    <Trash2 />
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        {isDesktop ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="bg-blue-200 dark:bg-[#0f172a] hover:bg-blue-400">
                                        <FilePenLine className="text-blue-700" size={isDesktop ? 16 : 14} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit this meeting</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button className="bg-blue-200 dark:bg-[#0f172a] hover:bg-blue-400 flex-shrink-0">
                                <FilePenLine className="text-blue-700" size={14} />
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="flex flex-col gap-2">
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="flex flex-col gap-2">
                                This action cannot be undone. This will permanently delete meeting and remove your data from our servers.
                                <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                                    <Trash2 />
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        {isDesktop ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="dark:bg-[#450a0a] bg-red-200 hover:bg-red-400">
                                        <Trash className="text-red-700" size={isDesktop ? 16 : 14} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delete this meeting</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Button className="bg-red-200 dark:bg-[#450a0a] hover:bg-red-400 flex-shrink-0">
                                <Trash className="text-red-700" size={14} />
                            </Button>
                        )}
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="flex flex-col gap-2">
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="flex flex-col gap-2">
                                This action cannot be undone. This will permanently delete meeting and remove your data from our servers.
                                <Button className="w-full rounded-lg bg-red-500 hover:bg-red-800">
                                    <Trash2 />
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticateComponent>
    );

    // Common participants popup
    const ParticipantsPopup = () => (
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
                        initial={isDesktop ? { scale: 0.9, y: 20 } : { y: "100%" }}
                        animate={isDesktop ? { scale: 1, y: 0 } : { y: 0 }}
                        exit={isDesktop ? { scale: 0.9, y: 20 } : { y: "100%" }}
                        transition={{ type: "spring", damping: 30 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl ${isDesktop ? "max-w-md w-full max-h-[80vh]" : "rounded-t-2xl mt-auto w-full h-[90vh] flex flex-col"}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h3 className="text-lg font-semibold">
                                {isDesktop ? "Meeting Participants" : "Participants"}
                            </h3>
                            <button
                                onClick={() => setShowParticipants(false)}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`p-4 ${isDesktop ? "overflow-y-auto max-h-[60vh]" : "overflow-y-auto flex-grow"}`}>
                            {meeting.joinusList.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No participants yet
                                </div>
                            ) : (
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
                            )}
                        </div>

                        <div className="border-t p-4 flex justify-end">
                            <Button
                                onClick={() => setShowParticipants(false)}
                                className={isDesktop ? "" : "w-full"}
                            >
                                Close
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full my-3 md:my-4  px-5 overflow-x-hidden"
            >
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm py-2">
                    {/* Header - Different layout based on screen size */}
                    <CardHeader className={`py-2 px-3 md:px-4 ${isDesktop ? "flex justify-between items-center" : "flex flex-col gap-3"}`}>
                        {isDesktop ? (
                            <>
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
                                <ActionButtons />
                            </>
                        ) : (
                            <>
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
                                <ActionButtons />
                            </>
                        )}
                    </CardHeader>

                    {/* Content */}
                    <CardContent className={`space-y-2 py-1 px-3 ${isDesktop ? "py-2 px-4 pb-3" : "pb-2"}`}>
                        <p className={`text-muted-foreground text-sm ${isDesktop ? "" : "line-clamp-3"}`}>
                            {meeting.description}
                        </p>
                    </CardContent>

                    {/* Footer - Different layout based on screen size */}
                    <CardFooter className={`${isDesktop ? "flex flex-wrap gap-3 justify-center sm:justify-between text-sm py-2 px-6 border-t" : "grid grid-cols-2 gap-2 text-sm py-2 px-3 border-t"}`}>
                        <div className={`flex items-center gap-2 bg-muted text-muted-foreground rounded-full ${isDesktop ? "px-3 py-1" : "px-2.5 py-1 text-xs"}`}>
                            <CalendarRange className={`text-primary ${isDesktop ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                            <span className={isDesktop ? "font-medium" : ""}>{formattedDate}</span>
                        </div>

                        <div className={`flex items-center gap-2 bg-muted text-muted-foreground rounded-full ${isDesktop ? "px-3 py-1" : "px-2.5 py-1 text-xs"}`}>
                            <Clock className={`text-primary ${isDesktop ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                            <span className={isDesktop ? "font-medium" : ""}>{formattedTime}</span>
                        </div>

                        <div className={`flex items-center gap-2 bg-muted text-muted-foreground rounded-full ${isDesktop ? "px-3 py-1" : "px-2.5 py-1 text-xs"} ${isDesktop ? "" : "col-span-2"}`}>
                            <MapPinned className={`text-primary ${isDesktop ? "w-4 h-4" : "w-3.5 h-3.5"}`} />
                            <span className={`${isDesktop ? "font-medium" : "truncate"}`}>
                                {meeting.meetingArea}
                            </span>
                        </div>

                        {isDesktop ? (
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
                                    <p>View participant members</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <button
                                onClick={() => setShowParticipants(true)}
                                className="flex items-center gap-2 bg-muted dark:bg-card-foreground hover:bg-muted/80 transition-colors text-muted-foreground rounded-full px-2.5 py-1 text-xs col-span-2 justify-center"
                            >
                                <Users2 className="w-3.5 h-3.5 text-primary" />
                                <span>
                                    {meeting.joinusList.length} participant
                                    {meeting.joinusList.length !== 1 ? "s" : ""}
                                </span>
                            </button>
                        )}
                    </CardFooter>
                </div>
            </motion.div>

            <ParticipantsPopup />
        </>
    );
};

export default MeetingComponent;