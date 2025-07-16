import { IsMobile } from "@/components/hook/IsMobile";
import MobileNotice from "@/components/noticeboard/MobileNotice";
import PcNotice from "@/components/noticeboard/PcNotice";
import MobileSyllabus from "@/components/syllabus/MobileSyllabus";
import PcSyllabus from "@/components/syllabus/PcSyllabus";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/reduxHooks";
import Sampledata from "@/store/Sampledata";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PcRoutine from "@/components/routine/PcRoutine";
const RoutineView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    const userRole: string = useAppSelector((state) => state.user.role);
    const routines = Sampledata.routine;

    return (
        <>
            <div className="  z-[9999] h-10 fixed top-12  flex right-10   gap-2">
                <div>
                    <Select>
                        <SelectTrigger className="w-150px] bg-slate-200">
                            <SelectValue placeholder="Semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 semester</SelectItem>
                            <SelectItem value="2">2 semester</SelectItem>
                            <SelectItem value="3">3 semester</SelectItem>
                            <SelectItem value="4">4 semester</SelectItem>
                            <SelectItem value="5">5 semester</SelectItem>
                            <SelectItem value="6">6 semester</SelectItem>
                            <SelectItem value="7">7 semester</SelectItem>
                            <SelectItem value="8">8 semester</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AuthenticateComponent roles={["hod"]}>
                    <div>
                        <Button className="px-2 hover:bg-blue-900 bg-blue-500">
                            <Plus /> Add
                        </Button>
                    </div>
                </AuthenticateComponent>
            </div>
            {isMobile ? (
                <>
                    {/* {syllabus.map((syllabus) => (
                        <MobileSyllabus syllabus={syllabus} />
                    ))} */}
                </>
            ) : (
                <div className=" w-full  flex justify-center items-center flex-col px-10 ">
                    {routines.map((routine) => (
                        // <PcRoutine routines={routine} sem="1"/><>
                        <></>
                    ))}
                </div>
            )}
        </>
    );
};

export default RoutineView;

//TODO:routine