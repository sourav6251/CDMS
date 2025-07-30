
import { useEffect, useState } from "react";
import { IsMobile } from "@/components/hook/IsMobile";
import MobileSyllabus from "@/components/syllabus/MobileSyllabus";
// import PcSyllabus from "@/components/syllabus/PcSyllabus";
import { Button } from "@/components/ui/button";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import { Loader2, Plus } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import apiStore from "@/api/apiStore";
import PCSyllabus from "@/components/syllabus/PCSyllabus";
// import PCSyllabus from "@/components/syllabus/PCSyllabus";

const SyllabusView = () => {
  const isMobile = IsMobile("(max-width: 768px)");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [isFetching, setIsFetching] = useState(false);
  const [syllabus, setSyllabus] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [paperCode, setPaperCode] = useState("");
  const [paperName, setPaperName] = useState("");
  const [semester, setSemester] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSemesterChange = async (value: string) => {
    setSelectedSemester(value);
    getSyllabus(value, currentPage.toString(), "10");
  };

  const getSyllabus = async (semester: string, page: string = "1", limit: string = "10") => {
    setIsFetching(true);
    try {
      const response = await apiStore.getallSyllabus(semester, page, limit);
      setSyllabus(response.data.data.syllabus);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(response.data.data.page);
    } catch (error: any) {
      console.error("Failed to fetch syllabus:", error);
    } finally {
      setIsFetching(false);
    }
  };

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
      getSyllabus(selectedSemester);
    } catch (err) {
      console.error("Failed to create syllabus", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSyllabus("1");
  }, []);

  return (
    <>
      <div className="fixed top-12 right-10 z-[9999] h-10 flex gap-2">
        <Select value={selectedSemester} onValueChange={handleSemesterChange}>
          <SelectTrigger className="w-[150px] bg-slate-200">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <SelectItem key={sem} value={sem.toString()}>{sem} semester</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <AuthenticateComponent roles={["hod"]}>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-2 bg-blue-500 hover:bg-blue-900">
                <Plus /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Syllabus</DialogTitle>
                <DialogDescription asChild>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md w-full max-w-md mx-auto">
                    <Input
                      placeholder="Syllabus PaperCode"
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
                      onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    />
                    <Button disabled={loading} type="submit" className="bg-blue-500 hover:bg-blue-700">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} /> Submitting...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2" size={18} /> Add Syllabus
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
<div className="h-full flex flex-col justify-between">
      {isFetching ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : syllabus.length === 0 ? (
        <div className="w-full text-center mt-20 text-gray-500 text-lg font-medium">
          No Syllabus Available for semester {selectedSemester}
        </div>
      ) : isMobile ? (
        <>{syllabus.map((syllabus: any) => <MobileSyllabus syllabus={syllabus} key={syllabus._id} />)}</>
      ) : (
        <div className="w-full flex justify-center items-center flex-col px-10">
          
            <PCSyllabus
              syllabuses={syllabus}
              // key={syllabus._id}
              fetchNotice={() => getSyllabus(selectedSemester)}
            />
        </div>
      )}
      {totalPages > 1 && (
  <div className="flex justify-center gap-2 my-4">
    {[...Array(totalPages)].map((_, index) => {
      const pageNum = index + 1;
      return (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          disabled={pageNum === currentPage}
          onClick={() => {
            setCurrentPage(pageNum);
            getSyllabus(selectedSemester, pageNum.toString(), "10");
          }}
        >
          {pageNum}
        </Button>
      );
    })}
  </div>
)}
</div>
    </>
  );
};

export default SyllabusView;
