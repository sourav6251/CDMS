import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiStore from "@/api/apiStore";
import { useAppSelector } from "@/store/reduxHooks";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import CertificateView from "./CertificateView";
import { Loader } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
  } from "@/components/ui/popover";
  
import { Checkbox } from "@/components/ui/checkbox";

// email
// name
// userId
// userModel
const prefixOptions = ["Dr.", "Mr.", "Mrs"];
const designationOptions = [
    "SACT",
    "Professor",
    "Associate Professor",
    "Assistant Professor",
];
const institutionTypes = ["College", "University"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
const genders = ["Male", "Female", "Other"];

type FormType = "moderator" | "external";

interface CertificateFormData {
    memoNumber: string;
    honorifics: string;
    professorName: string;
    designation: string;
    department: string;
    address: string;
    institutionType: string;
    institutionName: string;
    degree: string;
    semester: string[];
    subject: string;
    paperName: string;
    dateOfExamination: string;
    examStartTime: string;
    examEndTime: string;
    gender: string;
    studentsNo: string;
    examinersNo: string;
    examType: string;
    userID: string;
    userModel: string;
    CertificateType: FormType;
    status: string;
    nonExistUser:string;
}

const initialData: CertificateFormData = {
    memoNumber: "",
    honorifics: "",
    professorName: "",
    designation: "",
    department: "",
    address: "",
    institutionType: "",
    institutionName: "",
    semester: [],
    subject: "",
    degree: "",
    paperName: "",
    dateOfExamination: "",
    examStartTime: "",
    examEndTime: "",
    gender: "",
    studentsNo: "",
    examinersNo: "",
    examType: "",
    userID: "",
    userModel: "",
    nonExistUser: "",
    CertificateType: "moderator",
    status: "pending",
};
interface Certificate {
    _id: string;
    memoNumber: string;
    address: string;
    creator: string;
    user: string;
    honorifics: "Dr."| "Mr."| "Mrs";
    userModel: "user" | "normaluser";
    CertificateType: "moderator" | "external";
    designation: string;
    department: string;
    institutionType: "College"| "University";
    institutionName: string;
    degree: string;
    semester: string[];
    subject: string;
    paperName: string;
    dateOfExamination?: string;
    examStartTime: string;
    examEndTime: string;
    gender: string;
    studentsNo: string;
    examinersNo: string;
    examType: string;
    nonExistUser: string;
    status: "reject" | "pending" | "accept";
    createdAt: string;
  //   updatedAt: string;
  //   __v: number;
  }
  
const CertificateGenerator: React.FC = () => {
    const [formType, setFormType] = useState<FormType>("moderator");
    const [formData, setFormData] = useState<CertificateFormData>(initialData);
    const role = useAppSelector((state) => state.user.role);
    const [submiting,setSubmiting]=useState(false)
    const [show,setShow]=useState(true)
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [featchCertificates, setfeatchCertificates] = useState(false);
    // const handleChange = (field: keyof CertificateFormData, value: string) => {
    //     setFormData((prev) => ({ ...prev, [field]: value }));
    // };
    const handleChange = (field: keyof CertificateFormData, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
      };
    // const handleCheckboxChange=(semester: string) => {
    // setFormData((prev) => ({ ...prev, semester:prev.semester.includes(semester) }))
    // }
      const fetchCertificates = async () => {
        setfeatchCertificates(false)
        try {
          const response =
            role === "external"
              ? await apiStore.getExternalCertificate()
              : await apiStore.getAllExternalCertificate();
    
          setCertificates(response?.data.data || []);
          console.log("fetchCertificates=>",response?.data.data);
          
        } catch (error) {
          console.error("Fetch error:", error);
        }finally{
            setfeatchCertificates(true)
        }
      };
      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmiting(true)

        // console.log("handleSubmit=>",formData);
        formData.CertificateType=formType
        await apiStore.generateCertificate(formData);
        setSubmiting(false)
    };
useEffect(()=>{
    fetchCertificates();
},[])
    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            {!featchCertificates?<> <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div></>:<>
        {
            certificates.length!=0 &&
            <CertificateView certificate={certificates} fetchCertificate={fetchCertificates}/>
        }
            </>}
            {/* <div> */}
            <Button onClick={()=>setShow(!show)} className="end-0" hidden={!featchCertificates}>Generate Certificate</Button>
            <h2 hidden={show} className="text-2xl font-bold text-center mb-4">
                Certificate Generator
            </h2>
            <Tabs
             hidden={show}
                defaultValue="moderator"
                className="w-full"
                onValueChange={(val) => {
                    setFormType(val as FormType);
                    setFormData((prev) => ({
                        ...prev,
                        CertificateType: formType, // ✅ update this line
                    }));
                }}
            >

                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="moderator">Moderator</TabsTrigger>
                    <TabsTrigger value="external">External</TabsTrigger>
                </TabsList>

                <TabsContent value="moderator">
                    <Form
                        type="moderator"
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        role={role}
                        submiting={submiting}
                        // handleCheckboxChange={handleCheckboxChange}
                    />
                </TabsContent>

                <TabsContent value="external">
                    <Form
                        type="external"
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        role={role}
                        submiting={submiting}
                        // handleCheckboxChange={handleCheckboxChange}
                    />
                </TabsContent>
            </Tabs>
            {/* </div> */}
            
        </div>
    );
};

interface FormProps {
    type: FormType;
    formData: CertificateFormData;
    handleChange: (field: keyof CertificateFormData, value: string | string[]) => void;
    handleSubmit: (e: React.FormEvent) => void;
    role: string;
    submiting:boolean;
}

const Form: React.FC<FormProps> = ({
    formData,
    handleChange,
    handleSubmit,
    type,
    role,
    submiting,
    // handleCheckboxChange
}) => {

  
    // const value = String(sem);
    // const isChecked = formData.semester.includes(value);
    const [allUsers, setAllUsers] = useState<{ name: string; email: string; userId: string; userModel: string }[]>([]);
    const [manuallEntry,setManuallEntry]=useState(false)
    const getAllExternalUsers = async () => {
        try {
            const response = await apiStore.getAllExternalUsers();
            setAllUsers(response.data.data)
            console.log("allUsers",allUsers);
            
        } catch (error) {}
    };
    useEffect(() => {
        if (role==='hod') {
        getAllExternalUsers();
        }
    }, [role]);

    const isOddSemester = (sem: string) => {
        const num = parseInt(sem);
        return !isNaN(num) && num % 2 !== 0;
    };
    const examTypeOptions = ["Theory", "Practical", "Project"];
 
    const certificateRef = useRef<HTMLDivElement>(null);
    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {type === "moderator" ? "Moderator" : "External"}
                            Form
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <AuthenticateComponent roles={["hod"]}>
                            <div className="space-y-1">
                                <Label>Memo No</Label>
                                <Input
                                    value={formData.memoNumber}
                                    onChange={(e) =>
                                        handleChange(
                                            "memoNumber",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </AuthenticateComponent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <Label>Designation</Label>
                                <Select
                                    onValueChange={(val) =>
                                        handleChange("designation", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Designation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {designationOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Honorifics</Label>
                                <Select
                                    onValueChange={(val) =>
                                        handleChange("honorifics", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Honorifics" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {prefixOptions.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        {role === "hod" && (
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="manual-entry"
                            checked={manuallEntry}
                            onChange={(e) => {
                            setManuallEntry(e.target.checked);
                            if (e.target.checked) {
                                handleChange("userID", "");
                                handleChange("userModel", "");
                            } else {
                                handleChange("nonExistUser", "");
                            }
                            }}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="manual-entry">Enter name manually (not in list)</Label>
                        </div>

                        {manuallEntry ? (
                        <div className="space-y-1">
                            <Label>Professor Name (Manual)</Label>
                            <Input
                            placeholder="Enter professor name"
                            value={formData.nonExistUser}
                            onChange={(e) => handleChange("nonExistUser", e.target.value)}
                            />
                        </div>
                        ) : (
                        <div className="space-y-1">
                            <Label>Select Professor</Label>
                            <Select
                            onValueChange={(val) => {
                                const selectedUser = allUsers.find((user) => user.userId === val);
                                if (selectedUser) {
                                handleChange("professorName", selectedUser.name);
                                handleChange("userID", selectedUser.userId);
                                handleChange("userModel", selectedUser.userModel);
                                handleChange("nonExistUser", "");
                                }
                            }}
                            >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Professor" />
                            </SelectTrigger>
                            <SelectContent>
                                {allUsers.map((user) => (
                                <SelectItem key={user.userId} value={user.userId}>
                                    {user.name} ({user.email})
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                        </div>
                        )}
                    </div>
                    )}

                        

                        <div className="space-y-1">
                            <Label>Department Name</Label>
                            <Input
                                value={formData.department}
                                onChange={(e) =>
                                    handleChange("department", e.target.value)
                                }
                            />
                        </div>

                        {type === "external" && (
                            <div className="space-y-1">
                                <Label>Address</Label>
                                <Textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleChange("address", e.target.value)
                                    }
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <Label>Institution Type</Label>
                                <Select
                                    onValueChange={(val) =>
                                        handleChange("institutionType", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutionTypes.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Institution Name</Label>
                                <Input
                                    value={formData.institutionName}
                                    onChange={(e) =>
                                        handleChange(
                                            "institutionName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

{type === "moderator" ? (
  <div className="space-y-1">
    <Label>Semester (Multiple)</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {formData.semester.length > 0
            ? `${formData.semester.length} semester(s) selected`
            : "Select Semesters"}
          <span className="ml-2">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-[300px] max-h-60 overflow-y-auto p-2">
        {semesters.map((sem) => {
          const value = String(sem);
          const isChecked = formData.semester.includes(value);
          return (
            <div key={value} className="flex items-center gap-2 py-2">
              <Checkbox
                id={`semester-${value}`}
                checked={isChecked}
                onCheckedChange={() => {
                  const updatedSemesters = isChecked
                    ? formData.semester.filter((s) => s !== value)
                    : [...formData.semester, value];
                  handleChange("semester", updatedSemesters);
                }}
              />
              <Label htmlFor={`semester-${value}`} className="text-sm sm:text-base">
                {value}
              </Label>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  </div>
) : (
  <div className="space-y-1">
    <Label>Semester</Label>
    <Select
      onValueChange={(val) => handleChange("semester", [val])}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Semester" />
      </SelectTrigger>
      <SelectContent>
        {semesters.map((s) => (
          <SelectItem key={s} value={String(s)}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
                            <div className="space-y-1">
                                <Label>Degree</Label>
                                <Select
                                    onValueChange={(val) =>
                                        handleChange("degree", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Degree" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="UG">UG</SelectItem>
                                        <SelectItem value="PG">PG</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {type === "external" && (
                                <div className="space-y-1">
                                    <Label>Exam Type</Label>
                                    <Select
                                        onValueChange={(val) =>
                                            handleChange("examType", val)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Exam Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {examTypeOptions.map((opt) => (
                                                <SelectItem
                                                    key={opt}
                                                    value={opt}
                                                >
                                                    {opt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label>Subject</Label>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) =>
                                        handleChange("subject", e.target.value)
                                    }
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Paper Name</Label>
                                <Input
                                    value={formData.paperName}
                                    onChange={(e) =>
                                        handleChange(
                                            "paperName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-1">
                                <Label>Date Of Examination</Label>
                                <Input
                                    type="date"
                                    value={formData.dateOfExamination}
                                    onChange={(e) =>
                                        handleChange(
                                            "dateOfExamination",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            {type === "external" && (
                                <>
                                    <div className="space-y-1">
                                        <Label>Exam Start Time</Label>
                                        <Input
                                            type="time"
                                            value={formData.examStartTime}
                                            onChange={(e) =>
                                                handleChange(
                                                    "examStartTime",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Exam End Time</Label>
                                        <Input
                                            type="time"
                                            value={formData.examEndTime}
                                            onChange={(e) =>
                                                handleChange(
                                                    "examEndTime",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </>
                            )}
                            <AuthenticateComponent roles={["hod","external"]}>
                            <div className="space-y-1">
                                <Label>Gender</Label>
                                <Select
                                    onValueChange={(val) =>
                                        handleChange("gender", val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genders.map((opt) => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            </AuthenticateComponent>
                        </div>

                        {type === "external" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1">
                                    <Label>Number of Students</Label>
                                    <Input
                                        type="number"
                                        value={formData.studentsNo}
                                        onChange={(e) =>
                                            handleChange(
                                                "studentsNo",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter number of students"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label>Number of Examiners</Label>
                                    <Input
                                        type="number"
                                        value={formData.examinersNo}
                                        onChange={(e) =>
                                            handleChange(
                                                "examinersNo",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter number of examiners"
                                    />
                                </div>
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-6" disabled={submiting}>
                            {submiting ?<Loader className="animate-spin"/>:"Submit"}
                            
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </>
    );
};

export default CertificateGenerator;

