import { useEffect, useState } from "react";
import apiStore from "@/api/apiStore";
import { IsMobile } from "@/components/hook/IsMobile";
import MobileNotice from "@/components/noticeboard/MobileNotice";
import PcNotice from "@/components/noticeboard/PcNotice";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/reduxHooks";
import { Loader, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
interface NoticeFormFields {
    title: string;
    description: string;
    media?: File | null;
  }
const NoticeView = () => {
  const isMobile = IsMobile("(max-width: 768px)");
  const userRole: string = useAppSelector((state) => state.user.role);
const [notices,setNotices]=useState([]);
const [isLoading,setIsLoading]=useState(false)
const [creating,setCreating]=useState(false)
  const [formData, setFormData] = useState<NoticeFormFields>({
    title: "",
    description: "",
    media: null,
  });
  
  const fetchAllNotice = async () => {
    setIsLoading(true)
    try {
      const response = await apiStore.getallNotice();
      setNotices(response.data.data);
      console.log("response.data.data",response.data.data);
      
    } catch (error: any) {
      console.error("Error fetching notices:", error);
    }finally{
      setIsLoading(false)
    }
  };

  const handleSubmit = async () => {
  
    setCreating(true)
    try {
      await apiStore.addNotice(formData); 
      fetchAllNotice();
      // setDialogOpen(false);
      setFormData({ title: "", description: "", media: null });
    } catch (err) {
      console.error("Failed to add notice", err);
    }finally{
      setCreating(false)
    }
  };
  

  useEffect(() => {
    fetchAllNotice();
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-start px-4">
      {userRole === "hod" && (
     <Dialog>
     <DialogTrigger asChild>
       <div className="fixed top-14 right-10 z-[9999]">
         <Button className="px-2 hover:bg-blue-900 bg-blue-500">
           <Plus className="mr-1" /> Add
         </Button>
       </div>
     </DialogTrigger>
   
     <DialogContent className="max-w-md w-full">
       <DialogHeader>
         <DialogTitle>Add New Notice</DialogTitle>
         <DialogDescription>
           Fill in the details to post a new notice to the board.
         </DialogDescription>
       </DialogHeader>
   
       <Input
         placeholder="Title"
         value={formData.title}
         onChange={(e) =>
           setFormData({ ...formData, title: e.target.value })
         }
       />
   
       <Textarea
         placeholder="Description"
         value={formData.description}
         onChange={(e) =>
           setFormData({ ...formData, description: e.target.value })
         }
       />
   
       <Input
         type="file"
         accept="image/*,video/*"
         onChange={(e) =>
           setFormData({
             ...formData,
             media: e.target.files?.[0] || null,
           })
         }
       />
   
       <Button onClick={handleSubmit} className="w-full mt-4"  disabled={creating}>
        {creating?<Loader className="animate-spin text-blue-700" />:"Submit"}
         
       </Button>
     </DialogContent>
   </Dialog>
   
      )}
{isLoading ?  <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-800 border-solid"></div>
        </div>:<>   {isMobile
        ? notices.map((notice:any) => (
            <MobileNotice key={notice._id} notice={notice}  fetchNotice={fetchAllNotice}/>
          ))
        : notices.map((notice:any) => (
            <PcNotice key={notice._id} notice={notice} fetchNotice={fetchAllNotice}/>
          ))}</>}
   
    </div>
  );
};

export default NoticeView;
