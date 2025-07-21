import { IsMobile } from "@/components/hook/IsMobile";
import MobileSyllabus from "@/components/syllabus/MobileSyllabus";
import PcSyllabus from "@/components/syllabus/PcSyllabus";
import { Button } from "@/components/ui/button";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Loader2, Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import apiStore from "@/api/apiStore";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const SyllabusView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    // const syllabus = Sampledata.syllabus;
    const [selectedSemester, setSelectedSemester] = useState("1");
    const [isFetching, setIsFetching] = useState(false);

const [syllabus,setSyllabus]=useState([])
    const handleSemesterChange = async(value: string) => {
        console.log("Selected Semester:", value);
        setSelectedSemester(value);
        getSyllabus(value)
    };
    const getSyllabus = async (selectedSemester: string) => {

        setIsFetching(true);
        console.log("response=>");
        try {
          const response= await apiStore.getallSyllabus(selectedSemester);
          setSyllabus(response.data.data)
          console.log("response=>",response);
          
        } catch (error: any) {}finally{

    setIsFetching(false);
        }
    };
    const [paperCode, setPaperCode] = useState("");
    const [paperName, setPaperName] = useState("");
    const [semester, setSemester] = useState("1");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paperCode || !paperName || !semester) return;

        const formData = new FormData();
        formData.append("paperCode", paperCode);
        formData.append("paperName", paperName);
        formData.append("semester", semester);
        if (file) formData.append("media", file);

        try {
            setLoading(true);
            await apiStore.addSyllabus(formData);
            setPaperCode("");
            setPaperName("");
            setSemester("1");
            setFile(null);
        } catch (err) {
            console.error("Failed to create syllabus", err);
        } finally {
            setLoading(false);
            getSyllabus(selectedSemester)
        }
    };
    useEffect(()=>{getSyllabus("1")},[])
    return (
        <>
            <div className="  z-[9999] h-10 fixed top-12  flex right-10   gap-2">
                <div>
                    <Select
                        value={selectedSemester}
                        onValueChange={handleSemesterChange}
                    >
                        <SelectTrigger className="w-[150px] bg-slate-200">
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
                <Dialog>
  <DialogTrigger asChild><Button className="px-2 hover:bg-blue-900 bg-blue-500">
                            <Plus /> Add
                        </Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription asChild>
      <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md w-full max-w-md mx-auto"
        >
            <Input
                placeholder="Syllabus Title"
                value={paperCode}
                onChange={(e) => setPaperCode(e.target.value)}
                required
            />
            <Textarea
                placeholder="Syllabus PaperName"
                value={paperName}
                onChange={(e) => setPaperName(e.target.value)}
                required
            />
            <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="bg-slate-100">
                    <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                            {sem} Semester
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => {
                    if (e.target.files) setFile(e.target.files[0]);
                }}
            />

            <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
                {loading ? (
                    <>
                        <Loader2 className="animate-spin mr-2" size={18} />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Plus className="mr-2" size={18} />
                        Add Syllabus
                    </>
                )}
            </Button>
        </form> 
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
                    
                </AuthenticateComponent>
            </div>
            {isFetching ? (
     <div className="flex items-center justify-center h-[50vh]">
     <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
   </div>
) : syllabus.length === 0 ? (
    <div className="w-full text-center mt-20 text-gray-500 text-lg font-medium">
        No Syllabus Available for semester {selectedSemester}
    </div>
) : isMobile ? (

    <>
        {syllabus.map((syllabus: any) => (
            <MobileSyllabus syllabus={syllabus} key={syllabus._id} />
        ))}
    </>
) : (
    <div className="w-full flex justify-center items-center flex-col px-10">
        {syllabus.map((syllabus: any) => (
          <PcSyllabus
          syllabus={syllabus}
          key={syllabus._id}
          fetchNotice={() => getSyllabus(selectedSemester)}
        />
          ))}
    </div>
)}

        </>
    );
};

export default SyllabusView;
