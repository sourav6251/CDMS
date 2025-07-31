import { useEffect, useState } from "react";
import apiStore from "@/api/apiStore";
import { IsMobile } from "@/components/hook/IsMobile";
import MobileMeeting from "@/components/meeting/MobileMeeting";
import PcMeeting from "@/components/meeting/PcMeeting";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/reduxHooks";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNo?: string;
  role?: string;
}

interface NewUser {
  name: string;
  email: string;
  phoneNo?: string;
}

interface FormData {
  title: string;
  description: string;
  meetingTime: string;
  meetingArea: string;
  usersID: string[];
  users: NewUser[];
}

const MeetingView = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    meetingTime: "",
    meetingArea: "",
    usersID: [],
    users: [],
  });

  const [newUser, setNewUser] = useState<NewUser>({ name: "", email: "", phoneNo: "" });
  const [creating, setCreating] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const isMobile = IsMobile("(max-width: 768px)");
  const userRole: string = useAppSelector((state) => state.user.role);

  useEffect(() => {
    fetchMeeting();
  }, []);
  

  const fetchMeeting = async (page = 1) => {
    setLoadingMeetings(true);
    try {
      const res = await apiStore.getMeetingsByParticipantId(page);
      setMeetings(res.meetings);
      setTotalPages(res.totalPages);
      setCurrentPage(res.currentPage);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoadingMeetings(false);
    }
  };
  

  const fetchAllUsers = async () => {
    try {
      const response = await apiStore.getalluser();
      setAllUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      usersID: prev.usersID.includes(userId)
        ? prev.usersID.filter((id) => id !== userId)
        : [...prev.usersID, userId],
    }));
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewUser = () => {
    if (!newUser.name || !newUser.email) return;
    setFormData((prev) => ({ ...prev, users: [...prev.users, newUser] }));
    setNewUser({ name: "", email: "", phoneNo: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiStore.createMeeting(formData);
      setFormData({
        title: "",
        description: "",
        meetingTime: "",
        meetingArea: "",
        usersID: [],
        users: [],
      });
      fetchMeeting(); // Refresh list after creating
    } catch (err) {
      console.error("Failed to create meeting", err);
    } finally {
      setCreating(false);
    }
  };

  const AddButton = userRole === "hod" && (
    <Dialog onOpenChange={(open) => !open && fetchMeeting()}>
      <div className="fixed z-[9999] top-14 right-4 sm:right-10">
        <DialogTrigger asChild>
          <Button className="px-2 bg-blue-500 hover:bg-blue-900" onClick={fetchAllUsers}>
            <Plus className="mr-1" /> Add
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-xl max-h-[95vh] w-[95vw] rounded-2xl overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold">Schedule Meeting</DialogTitle>
          <DialogDescription>Create a new meeting and invite participants</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4 w-full">
          <div className="space-y-2">
            <Label>Meeting Title *</Label>
            <Input name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input name="meetingArea" value={formData.meetingArea} onChange={handleChange} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Date & Time *</Label>
              <Input
                type="datetime-local"
                name="meetingTime"
                value={formData.meetingTime.slice(0, 16)}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Participants</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.usersID.length > 0
                      ? `${formData.usersID.length} user(s) selected`
                      : "Select participants"}
                    <span className="ml-2">▼</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full sm:w-[300px] max-h-60 overflow-y-auto p-2">
                  {allUsers.map((user) => (
                    <div key={user._id} className="flex items-center gap-2 py-2">
                      <Checkbox
                        id={`user-${user._id}`}
                        checked={formData.usersID.includes(user._id)}
                        onCheckedChange={() => handleCheckboxChange(user._id)}
                      />
                      <Label htmlFor={`user-${user._id}`} className="text-sm sm:text-base">
                        {user.name}
                      </Label>
                      <span className="ml-auto text-xs text-gray-500">{user.role}</span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label>Add External Participant</Label>
            <Input name="name" value={newUser.name} onChange={handleNewUserChange} placeholder="Name" />
            <Input name="email" value={newUser.email} onChange={handleNewUserChange} placeholder="Email" />
            <Input name="phoneNo" value={newUser.phoneNo} onChange={handleNewUserChange} placeholder="Phone" />
            <Button type="button" onClick={handleAddNewUser} className="w-full sm:w-auto">
              <Plus className="mr-1" /> Add External Participant
            </Button>
          </div>

          {formData.users.length > 0 && (
            <div className="mt-2 space-y-1">
              <Label>External Participants Added:</Label>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {formData.users.map((user, index) => (
                  <li key={index} className="break-all">
                    {user.name} — {user.email}
                    {user.phoneNo && ` — ${user.phoneNo}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter className="pt-2 w-full">
            <Button type="submit" className="w-full sm:w-auto" disabled={creating}>
              Create Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  const renderMeetings = () => {
    if (loadingMeetings) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      );
    }

    if (meetings.length === 0) {
      return <div className="text-gray-500 mt-10 text-lg text-center">No meetings</div>;
    }

    return meetings.map((meeting: any) =>
      isMobile ? (
        <MobileMeeting key={meeting._id} meeting={meeting} fetchMeetings={fetchMeeting} />
      ) : (
        <PcMeeting key={meeting._id} meeting={meeting} fetchMeetings={fetchMeeting} />
      )
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-centerjustify-between ${
        isMobile ? " h-full  overflow-y-auto" : "px-10"
      }`}
    >
      {AddButton}
      {renderMeetings()}
      {totalPages > 1 && (
  <div className="flex justify-center gap-2 mt-6">
    {[...Array(totalPages)].map((_, index) => {
      const pageNum = index + 1;
      return (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          disabled={pageNum === currentPage}
          onClick={() => fetchMeeting(pageNum)}
        >
          {pageNum}
        </Button>
      );
    })}
  </div>
)}

    </div>
  );
};

export default MeetingView;
