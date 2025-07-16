import { IsMobile } from "@/components/hook/IsMobile";
import MobileMeeting from "@/components/meeting/MobileMeeting";
import PcMeeting from "@/components/meeting/PcMeeting";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/reduxHooks";
import Sampledata from "@/store/Sampledata";
import { Plus } from "lucide-react";

const MeetingView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
        const userRole: string = useAppSelector((state) => state.user.role);
    const meetings = Sampledata.meeting;
    return isMobile ? (
        <div className="h-full w-full flex flex-col justify-center items-center">
           {userRole =='hod' &&<div className="  z-0 h-10 fixed top-12  flex right-10"><Button className="px-2 hover:bg-blue-900 bg-blue-500"><Plus/> Add</Button></div>}
           {meetings.map((meeting) => (
                <MobileMeeting meeting={meeting} />
            ))}
        </div>
    ) : (
        <div className=" w-full flex justify-center items-center flex-col px-10 ">
             {userRole =='hod' &&<div className="   z-[9999] h-10 fixed top-14  flex right-10"><Button className="px-2 hover:bg-blue-900 bg-blue-500"><Plus/> Add</Button></div>}
            {meetings.map((meeting) => (
                <PcMeeting meeting={meeting} />
            ))}
        </div>
    );
};

export default MeetingView;
