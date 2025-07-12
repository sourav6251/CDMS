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
   
} from "lucide-react";
import { parse, isToday, isFuture } from "date-fns";

import { toast } from "sonner";
import apiStore from "../../api/apiStore";

const MaillMeetingContent = ({
    id,
    title,
    description,
    date_time, 
    participantsNo,
    participants,
    location,
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

export default MaillMeetingContent;
