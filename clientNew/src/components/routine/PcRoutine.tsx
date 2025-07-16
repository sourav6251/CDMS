import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/tabs";

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
  professor: Professor;
}

interface Schedule {
  dayName: string;
  timeSlots: TimeSlot[];
}

interface Routine {
  _id: string;
  semester: string;
  schedules: Schedule[];
}

interface Props {
  sem: string;
  routines: Routine[];
}

const PcRoutine: React.FC<Props> = ({ sem, routines }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(":" ).map(Number);
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRoutines = routines.filter((r) => r.semester === sem);

  return (
    <div>
      <Tabs defaultValue="Monday" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {days.map((day) => (
            <TabsTrigger key={day} value={day}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        <section className="p-4">
          <h1 className="text-xl font-semibold mb-4">
            {sem} Semester
          </h1>

          {days.map((day) => (
            <TabsContent key={day} value={day}>
              <div className="space-y-4">
                {filteredRoutines.map((routine) => {
                  const schedule = routine.schedules.find(
                    (s) => s.dayName === day
                  );
                  if (!schedule) return null;

                  return schedule.timeSlots.map((slot) => (
                    <Card key={slot._id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {slot.paperCode}
                            </span>
                            <span className="text-sm text-gray-500">
                              {slot.paperName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {slot.professor?.name || "Unknown"} ({slot.professor?.email || "N/A"})
                        </p>
                      </CardContent>
                    </Card>
                  ));
                })}

                {filteredRoutines.every(
                  (r) => !r.schedules.some((s) => s.dayName === day)
                ) && (
                  <p className="text-muted-foreground">
                    No routines for {day}
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </section>
      </Tabs>
    </div>
  );
};

export default PcRoutine;