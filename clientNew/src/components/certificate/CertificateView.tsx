import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/reduxHooks";
import apiStore from "@/api/apiStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  DownloadIcon,
  Edit,
  LucideEye,
  Trash,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AuthenticateComponent from "@/utils/AuthenticateComponent";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
interface Props {
  certificate: Certificate[];
  fetchCertificate: () => void;
}

const CertificateView: React.FC<Props>  = ({certificate , fetchCertificate}) => {
  const role = useAppSelector((state) => state.user.role);
  const [memoNumber,setMemoNumber]=useState("")

  const prefixOptions = ["Dr.", "Mr.", "Mrs"];
  const designationOptions = [
      "SACT",
      "Professor",
      "Associate Professor",
      "Assistant Professor",
  ];
  const examTypeOptions = ["Theory", "Practical"];
  const institutionTypes = ["College", "University"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const genders = ["Male", "Female"];
    const [formData, setFormData] = useState<Certificate>();
    const [editableCert, setEditableCert] = useState<Certificate | null>(null);

  
  const handleEdit=async(e: React.FormEvent)=>{
   
    e.preventDefault();
    console.log("handleEdit=>",formData);
    try {
        const response=await apiStore.updateCertificate(formData)
        console.log("response=>",response);
        fetchCertificate()

    } catch (error:any) {
    }
    
  }

const certificateApprove=async(certificateId:string,status:string)=>{
  if (status ==='accept' && memoNumber==='') {
    alert("Enter memo number")
    return;    
  }
    try {
      const payload={
        memoNumber:memoNumber,
         status:status
      }
     await apiStore.certificateStatusupadte(certificateId,payload)
     fetchCertificate()
    } catch (error:any) {
      
    }finally{
      setMemoNumber("")
    }
}
  
const handleChange = (field: keyof Certificate, value: string| string[],date:string ="2") => {
    setFormData((prev) => {
      if (!prev) return prev;
  
      let updatedValue: any = value;
  
      if (field === "dateOfExamination") {
        const selectedDate = new Date(date);
        updatedValue = selectedDate.toISOString(); 
      }
  
      return {
        ...prev,
        [field]: updatedValue,
      };
    });
  };
  
  
  const handleDelete = async (id: string) => {
    try {
    await  apiStore.deleteCertificate(id)
    fetchCertificate()
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Certificates</h2>
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificate.length > 0 ? (
              certificate.map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell>
                    {new Date(cert.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="capitalize">{cert.status}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Download Certificate */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" 
                                disabled={cert.status !== "accept"}>
                          <DownloadIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download</TooltipContent>
                    </Tooltip>

                    {/* Edit Certificate */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={cert.status !== "pending"}
                                onClick={() => setFormData({ ...cert })}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="overflow-hidden max-h-full">
                              <DialogHeader>
                                <DialogTitle>Edit Certificate</DialogTitle>
                                <DialogDescription >
                                 
                       
                                </DialogDescription>
                                
                              </DialogHeader>
                                        
                          <div className="overflow-y-auto max-h-[70vh] pr-2">
                              <form 
                                 className="space-y-4 mt-4  max-h-full">
                                  <Card>
                                      <CardHeader>
                                          <CardTitle>
                                              {/* {type === "moderator" ? "Moderator" : "External"} */}
                                              {cert.CertificateType}
                                          </CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-6">
                                          <AuthenticateComponent roles={["hod"]}>
                                              <div className="space-y-1">
                                                  <Label>Memo No</Label>
                                                  <Input
                                                      value={formData?.memoNumber}
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
                                                      value={formData?.designation}
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
                                                      value={formData?.honorifics}
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
                                          <div className="space-y-1">
                                              <Label>Department Name</Label>
                                              <Input
                                                  value={formData?.department}
                                                  onChange={(e) =>
                                                      handleChange("department", e.target.value)
                                                  }
                                              />
                                          </div>

                                          {cert.CertificateType === "external" && (
                                              <div className="space-y-1">
                                                  <Label>Address</Label>
                                                  <Textarea
                                                      value={formData?.address}
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
                                                      value={formData?.institutionType}
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
                                                      value={formData?.institutionName}
                                                      onChange={(e) =>
                                                          handleChange(
                                                              "institutionName",
                                                              e.target.value
                                                          )
                                                      }
                                                  />
                                              </div>
                                          {/* </div>

                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5"> */}
                                              <div className="space-y-1">
                                                  <Label>Semester</Label>
                                                  {formData?.CertificateType === "moderator" ? (
                                                    <div className="space-y-1">
                                                      {/* <Label>Semester (Multiple)</Label> */}
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
                                                      {/* <Label>Semester</Label> */}
                                                      <Select
                                                        onValueChange={(val) => handleChange("semester", [val])}
                                                        value={formData?.semester[0]}
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
                                              </div>

                                              <div className="space-y-1">
                                                  <Label>Degree</Label>
                                                  <Select
                                                      onValueChange={(val) =>
                                                          handleChange("degree", val)
                                                      }
                                                      value={formData?.degree}
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
                                              {cert.CertificateType  === "external" && (
                                                  <div className="space-y-1">
                                                      <Label>Exam Type</Label>
                                                      <Select
                                                          onValueChange={(val) =>
                                                              handleChange("examType", val)
                                                          }
                                                          value={formData?.examType}
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
                                                      value={formData?.subject}
                                                      onChange={(e) =>
                                                          handleChange("subject", e.target.value)
                                                      }
                                                  />
                                              </div>

                                              <div className="space-y-1">
                                                  <Label>Paper Name</Label>
                                                  <Input
                                                      value={formData?.paperName}
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
                                                    value={
                                                        formData?.dateOfExamination
                                                        ? new Date(formData.dateOfExamination).toISOString().slice(0, 10)
                                                        : ""
                                                    }
                                                    onChange={(e) =>
                                                        handleChange("dateOfExamination", "",e.target.value)
                                                    }
                                                    />
                                              </div>

                                              {cert.CertificateType === "external" && (
                                                  <>
                                                      <div className="space-y-1">
                                                          <Label>Exam Start Time</Label>
                                                          <Input
                                                            type="time"
                                                                value={formData?.examStartTime ?? ""}
                                                          
                                                            onChange={(e) => handleChange("examStartTime", e.target.value)}
                                                            />

                                                      </div>

                                                      <div className="space-y-1">
                                                          <Label>Exam End Time</Label>
                                                          <Input
                                                              type="time"
                                                              
                                                                value={formData?.examEndTime ?? ""}
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
                                              <div className="space-y-1">
                                                  <Label>Gender</Label>
                                                  <Select
                                                      onValueChange={(val) =>
                                                          handleChange("gender", val)
                                                      }
                                                      value={formData?.gender}
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
                                          </div>

                                          {cert.CertificateType  === "external" && (
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                  <div className="space-y-1">
                                                      <Label>Number of Students</Label>
                                                      <Input
                                                          type="number"
                                                          value={formData?.studentsNo}
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
                                                          value={formData?.examinersNo}
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

                                          <Button type="submit" className="w-full mt-6" onClick={handleEdit}>
                                              Submit
                                          </Button>
                                      </CardContent>
                                  </Card>
                              </form>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>


                    {/* View Certificate */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LucideEye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>

                    {/* Approve/Reject only for HOD */}
                    <AuthenticateComponent roles={["hod"]}>


                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={cert.status!=='pending'} onClick={()=>setMemoNumber(cert.memoNumber)}>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                            </DialogHeader>
                            <Label className="text-lg font-bold">Enter Memo Number</Label>
                            <Input type="text" value={memoNumber} onChange={(e) => setMemoNumber(e.target.value)}/>
                            <span hidden={memoNumber!==""} className="text-sm text-rose-500"> *Enter Memonumber</span>
                            {/* <div className="space-y-1">
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
                                                        </div> */}
                                                        {/* //todo: set gender into HOD */}
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => certificateApprove(cert._id,"accept")}
                                className="bg-green-600"
                              >
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={cert.status !== "pending"}
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Certificate</DialogTitle>
                              </DialogHeader>
                              <p className="text-sm text-muted-foreground">
                                Are you sure you want to reject this certificate?
                              </p>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  onClick={() => certificateApprove(cert._id, "reject")}
                                >
                                  Confirm Reject
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>Reject</TooltipContent>
                      </Tooltip>

                    </AuthenticateComponent>

                    {/* Delete Certificate */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                            </DialogHeader>
                            <p>This action cannot be undone. This will permanently delete the certificate.</p>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(cert._id)}
                              >
                                Confirm Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>


                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No certificates found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  );
};

export default CertificateView;
