import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Professor {
  _id: string;
  name: string;
  email: string;
}

interface TimeSlot {
  _id: string;
  paperCode: string;
  paperName: string;
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
}

interface Props {
  routines: Routine[];
}

const Routine: React.FC<Props> = ({ routines }) => {
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

  const selectedRoutine = routines[0];

  if (!selectedRoutine) {
    return <p className="text-center text-gray-500">No routine found</p>;
  }

  return (
    <div className="w-full mt-6 px-2 sm:px-4">
      <Tabs defaultValue="monday" className="w-full">
        {/* Tabs List */}
        {/* <TabsList className="w-full flex flex-wrap gap-2 justify-center sm:justify-start overflow-x-auto"> */}
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
                      className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 transition hover:shadow-md"
                    >
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                            {slot.paperCode}: {slot.paperName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Professor:</span>{" "}
                            {typeof slot.professor === "object" &&
                            slot.professor !== null
                              ? `${slot.professor.name} (${slot.professor.email})`
                              : `${slot.professor} (${slot.professorModel})`}
                          </p>
                        </div>

                        {/* Time Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-sm text-gray-600">
                          <div>
                            <span className="font-medium text-gray-800">
                              Start:
                            </span>{" "}
                            {formatTime(slot.startTime)}
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">
                              End:
                            </span>{" "}
                            {formatTime(slot.endTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">
                  No routine for {day}
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default Routine;
