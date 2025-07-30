import { useEffect, useState } from "react";
import apiStore from "@/api/apiStore";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCheck, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface ProfilePic {
    url: string;
    public_id: string | null;
}

interface RegisterUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    isApproved: boolean;
    createdAt: string;
    profile_pic: ProfilePic;
    phoneNo: string;
}

interface UnregisterUser {
    _id: string;
    name: string;
    email: string;
    phoneNo: string;
    createdAt: string;
}

const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-800 border-solid"></div>
    </div>
);

const MemberTableHeader = ({ headers }: { headers: string[] }) => (
    <TableHeader className="w-full">
        <TableRow className="w-full">
            {headers.map((header, idx) => (
                <TableHead key={idx}>{header}</TableHead>
            ))}
        </TableRow>
    </TableHeader>
);

const MemberView = () => {
    const [users, setUsers] = useState<RegisterUser[]>([]);
    const [registerRequestUsers, setRegisterRequestUsers] = useState<RegisterUser[]>([]);
    const [unregisterUsers, setUnregisterUsers] = useState<UnregisterUser[]>([]);

    const [loading, setLoading] = useState({
        register: false,
        unregister: false,
        request: false,
    });

    const fetchAllUsers = async () => {
        setLoading({ register: true, unregister: true, request: true });
        try {
            const [registeredRes, unregisterRes, requestRes] = await Promise.all([
                apiStore.getallregisteruser(),
                apiStore.getAllUnregisterUser(),
                apiStore.getAllRegisterRequestUser(),
            ]);

            setUsers(registeredRes.data.data);
            setUnregisterUsers(unregisterRes.data.data);
            setRegisterRequestUsers(requestRes.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading({ register: false, unregister: false, request: false });
        }
    };
    const hodApprovel=async(userID:string)=>{
      try {
        await apiStore.hodApprovel(userID)
        fetchAllUsers();
      } catch (error:any) {
      }
    }
    const hodDelete=async(userID:string)=>{
      try {
        await apiStore.hodDelete(userID)
        fetchAllUsers();
      } catch (error:any) {
      }
    }
    useEffect(() => {
        fetchAllUsers();
    }, []);

    return (
        <div className="h-full w-full flex flex-col items-center space-y-10">
            {/* Register Request Table */}
            <section className="w-full px-10">
                <h2 className="text-lg font-semibold mb-2">Member Requests</h2>
                {loading.request ? (
                    <LoadingSpinner />
                ) : (
                    <Table className="w-full">
                        <TableCaption>Pending registration approvals</TableCaption>
                        <MemberTableHeader
                            headers={[
                                "Profile Pic",
                                "Name",
                                "Email",
                                "Phone",
                                "Role",
                                "Status",
                                "Action",
                            ]}
                        />
                        <TableBody>
                            {registerRequestUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <img
                                            src={user.profile_pic.url}
                                            alt="profile"
                                            className="h-10 w-10 rounded-full object-cover shadow-md"
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNo || "---"}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                user.isApproved
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {user.isApproved ? "Approved" : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell >
                                    <Dialog>
                                      <DialogTrigger asChild><Button
                                            title="Approve"
                                            className="p-1 rounded hover:bg-green-100 text-green-600"
                                            variant="ghost"
                                            disabled={user.isApproved}
                                        >
                                            <CheckCheck size={18} />
                                        </Button></DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                              This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                                              <Button
                                                className="w-full rounded-lg bg-green-500 hover:bg-green-800"
                                                onClick={() => hodApprovel(user._id)}
                                              >
                                              Approve
                                              </Button>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                        
                                    <Dialog>
                                      <DialogTrigger asChild><Button
                                            title="Delete"
                                            className="p-1 rounded hover:bg-red-100 text-red-600"
                                            variant="ghost"
                                        >
                                            <Trash2 size={18} />
                                        </Button></DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                              This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                                              <Button
                                                className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                onClick={() => hodDelete(user._id)}
                                              >
                                              <Trash2 size={18}/>
                                              </Button>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                        
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>

            {/* Unregister Table */}
            <section className="w-full px-10">
                <h2 className="text-lg font-semibold mb-2">Unregistered Members</h2>
                {loading.unregister ? (
                    <LoadingSpinner />
                ) : (
                    <Table className="w-full">
                        <TableCaption>Guests / incomplete registrations</TableCaption>
                        <MemberTableHeader
                            headers={["Name", "Email", "Phone", "Created At", "Action"]}
                        />
                        <TableBody>
                            {unregisterUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNo || "---"}</TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                    </TableCell>
                                    <TableCell>
                                            
                                    <Dialog>
                                      <DialogTrigger asChild><Button
                                            title="Delete"
                                            className="p-1 rounded hover:bg-red-100 text-red-600"
                                            variant="ghost"
                                        >
                                            <Trash2 size={18} />
                                        </Button></DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                              This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                                              <Button
                                                className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                onClick={() => hodDelete(user._id)}
                                              >
                                              <Trash2 size={18}/>
                                              </Button>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>

            {/* Registered Table */}
            <section className="w-full px-10">
                <h2 className="text-lg font-semibold mb-2">Registered Members</h2>
                {loading.register ? (
                    <LoadingSpinner />
                ) : (
                    <Table className="w-full">
                        <TableCaption>Approved members list</TableCaption>
                        <MemberTableHeader
                            headers={[
                                "Profile Pic",
                                "Name",
                                "Email",
                                "Phone",
                                "Role",
                                "Status",
                                "Action",
                            ]}
                        />
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <img
                                            src={user.profile_pic.url}
                                            alt="profile"
                                            className="h-10 w-10 rounded-full object-cover shadow-md"
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phoneNo || "---"}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                user.isApproved
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {user.isApproved ? "Approved" : "Pending"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                       
                                           
                                    <Dialog>
                                      <DialogTrigger asChild><Button
                                            title="Delete"
                                            className="p-1 rounded hover:bg-red-100 text-red-600"
                                            variant="ghost"
                                        >
                                            <Trash2 size={18} />
                                        </Button></DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader className="flex flex-col gap-2">
                                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription className="flex flex-col gap-2">
                                              This action cannot be undone. This will permanently delete the meeting and remove your data from our servers.
                                              <Button
                                                className="w-full rounded-lg bg-red-500 hover:bg-red-800"
                                                onClick={() => hodDelete(user._id)}
                                              >
                                              <Trash2 size={18}/>
                                              </Button>
                                            </DialogDescription>
                                          </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>
        </div>
    );
};

export default MemberView;
