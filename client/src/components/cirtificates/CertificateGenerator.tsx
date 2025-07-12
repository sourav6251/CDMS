import  { useState, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import html2pdf from "html2pdf.js";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Mail } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import React from "react";
import apiStore from "../../api/apiStore";

const CertificateGenerator = () => {
    const [formData, setFormData] = useState({
        memoNumber: "",
        examinerName: " ",
        examinerDesignation: "",
        examinerDept: "",
        examinerCollege: "",
        institution: "",
        examType: "",
        examinerAddress: "",
        year: "",
        semester: "",
        degree: "",
        subject: "",
        course: "",
        paper : "",
        dateOfExam: "",
        timeOfExam: "",
        numberOfStudents: "",
        numberOfExaminers: "",
    });
    const role = useAuthStore((state) => state.role);

    const [display, setDisplay] = useState("mod");
    // Function to check if the semester is odd or even
    const isOddSemester = (semester: string): boolean => {
        const romanToInt: Record<string, number> = {
            I: 1,
            II: 2,
            III: 3,
            IV: 4,
            V: 5,
            VI: 6,
            VII: 7,
            VIII: 8,
        };

        const semNum = romanToInt[semester.toUpperCase()] || 0;
        return semNum % 2 === 1; // true = odd, false = even
    };

    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDownloadPDF = () => {
        if (certificateRef.current) {
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: "certificate.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };
            html2pdf().from(certificateRef.current).set(opt).save();
        }
    };

    // const handleSendEmail = async () => {
    //     if (!email) return;

    //     setIsSending(true);
    //     try {
    //         const htmlContent = certificateRef.current.innerHTML;
    //         await apiStore.certificateMail(email,"Certificate",htmlContent)
    //         // In a real app, you would call your backend API here
    //         // This is just a simulation
    //         console.log("Sending certificate to:", email);
    //         // await new Promise((resolve) => setTimeout(resolve, 2000));
    //         alert("Certificate sent successfully!");
    //     } catch (error) {
    //         console.error("Error sending email:", error);
    //         alert("Failed to send certificate. Please try again.");
    //     } finally {
    //         setIsSending(false);
    //     }
    // };

    return (
        <>
            {role == "hod" && (
                <section className="container py-6 rounded-md shadow flex gap-5 flex-col">
                    <Select 
                        value={display}
                        onValueChange={(val) => setDisplay(val)}
                    >
                        <SelectTrigger className="w-[160px] bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mod">Modaretor</SelectItem>

                            <SelectItem value="ext">External</SelectItem>
                        </SelectContent>
                    </Select>

                          {/* Part of External  cirtificate */}
                    {display === "ext" && (
    <div className="grid grid-cols-1 gap-8">
        {/* External-specific content goes here */}
        <Card>
            <CardHeader>
                <CardTitle>External Examiner Form</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 gap-8"> 
                        {/* Form Section - Left Side */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Certificate Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>   
                                        <Label>Memo Number</Label>
                                        <Input
                                            name="memoNumber"
                                            value={formData.memoNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Examiner Name</Label>
                                        <Input
                                            name="examinerName"
                                            value={formData.examinerName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Designation</Label>
                                            <Select
                                                value={
                                                    formData.examinerDesignation
                                                }
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        examinerDesignation:
                                                            value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select designation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SACT">
                                                        SACT
                                                    </SelectItem>
                                                    <SelectItem value="Professor">
                                                        Professor
                                                    </SelectItem>
                                                    <SelectItem value="Associate Professor">
                                                        Associate Professor
                                                    </SelectItem>
                                                    <SelectItem value="Assistant Professor">
                                                        Assistant Professor
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Department</Label>
                                            <Input
                                                name="examinerDept"
                                                value={formData.examinerDept}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>College</Label>
                                        <Input
                                            name="examinerCollege"
                                            value={formData.examinerCollege}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Textarea
                                            name="examinerAddress"
                                            value={formData.examinerAddress}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Year</Label>
                                        <Input
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label>Semester</Label>
                                            {/* <Input
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                    /> */}
                                            <Select
                                                value={formData.semester}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        semester: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="I">
                                                        I
                                                    </SelectItem>
                                                    <SelectItem value="II">
                                                        II
                                                    </SelectItem>
                                                    <SelectItem value="III">
                                                        III
                                                    </SelectItem>
                                                    <SelectItem value="IV">
                                                        IV
                                                    </SelectItem>
                                                    <SelectItem value="V">
                                                        V
                                                    </SelectItem>
                                                    <SelectItem value="VI">
                                                        VI
                                                    </SelectItem>
                                                    <SelectItem value="VII">
                                                        VII
                                                    </SelectItem>
                                                    <SelectItem value="VIII">
                                                        VIII
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Degree</Label>
                                            <Select
                                                value={formData.degree}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        degree: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select degree" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UG">
                                                        UG
                                                    </SelectItem>
                                                    <SelectItem value="PG">
                                                        PG
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subject</Label>
                                            <Input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Course</Label>
                                            <Input
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date of Exam</Label>
                                            <Input
                                                name="dateOfExam"
                                                value={formData.dateOfExam}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Time of Exam</Label>
                                            <Input
                                                name="timeOfExam"
                                                value={formData.timeOfExam}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Number of Students</Label>
                                            <Input
                                                name="numberOfStudents"
                                                value={
                                                    formData.numberOfStudents
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Number of Examiners</Label>
                                            <Input
                                                name="numberOfExaminers"
                                                value={
                                                    formData.numberOfExaminers
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Email Section */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                         Certificate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* <div className="space-y-2">
                                        <Label>Recipient Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="Enter recipient email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div> */}
                                    <div className="flex gap-2">
                                        {/* <Button
                                            onClick={handleSendEmail}
                                            disabled={isSending || !email}
                                            className="flex items-center gap-2"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {isSending
                                                ? "Sending..."
                                                : "Send Certificate"}
                                        </Button> */}
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadPDF}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Certificate Preview - Right Side */}
                        <div className="sticky top-4 h-fit">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Certificate Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        ref={certificateRef}
                                        className="p-8 bg-white text-black mx-auto"
                                        style={{
                                            width: "210mm",
                                            minHeight: "297mm",
                                            fontFamily:
                                                "Times New Roman, serif",
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                            padding: "20mm",
                                            border: "1px solid #e5e5e5",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <div className="text-right text-xs">
                                            Phone: 03228-252222(Principal)
                                        </div>
                                        {/* College Logo and Header */}
                                        <div className="flex items-start justify-start mb-4 gap-8 border-b-4 border-b-slate-900 ">
                                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                                <img src="data:image/jpeg;base64,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" />
                                            </div>
                                            <div>
                                                <div className="text-center font-bold text-2xl mb-2">
                                                    PANSKURA BANAMALI COLLEGE
                                                </div>
                                                <div className="text-center text-sm mb-4">
                                                    Largest Rural Based, NAAC
                                                    Re-accredited 'A' Grade
                                                    (2016-2021)
                                                    <br />
                                                    DST-FIST (Govt. of India)
                                                    Sponsored College
                                                    <br />
                                                    P.O. - Panskura R.S., PIN -
                                                    721152, Purba Medinipur,
                                                    West Bengal, India
                                                    <br />
                                                    Website:
                                                    www.panskurabanamalicollege.org
                                                    | E-mail:
                                                    principal.pbc@gmail.com
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row justify-between" >
                                        <div className="flex justify-end mb-2 text-sm">
                                            Memo Number:{" "}
                                            {formData.memoNumber || "____"}
                                        </div>

                                        <div className="flex justify-end mb-6 text-sm">
                                            Date:{" "}
                                            {formData.dateOfExam || "____"}
                                        </div>
                                        </div>


                                        <h2 className="text-center font-bold mb-4 underline">
                                            To Whom It May Concern
                                        </h2>

                                        <p className="mb-4 text-justify">
                                            This is to certify that{" "}
                                            <b>
                                                {formData.examinerName ||
                                                    "____"}
                                            </b>{" "}
                                            (
                                            {formData.examinerDesignation ||
                                                "____"}
                                            ) Dept. of{" "}
                                            {formData.examinerDept || "____"},{" "}
                                            {formData.examinerCollege || "____"}
                                            ,{" "}
                                            {formData.examinerAddress || "____"}
                                            , has successfully conducted the End
                                            Semester (Practical) Examination -{" "}
                                            {formData.year || "____"}, (
                                            {isOddSemester(formData.semester)
                                                ? "Odd Semester"
                                                : "Even Semester"}
                                            ) of Semester –{" "}
                                            {formData.semester || "____"},{" "}
                                            {formData.degree || "____"},
                                            Subject-{" "}
                                            {formData.subject || "____"},
                                            Course- {formData.course || "____"}{" "}
                                            on {formData.dateOfExam || "____"} (
                                            {formData.timeOfExam || "____"}) at
                                            this college as an external
                                            Examiner.
                                        </p>

                                        <p className="mb-2">
                                            Number of Students appeared in the
                                            said examination:{" "}
                                            {formData.numberOfStudents ||
                                                "____"}
                                        </p>
                                        <p className="mb-6">
                                            Number of Examiners involved in the
                                            said examination:{" "}
                                            {formData.numberOfExaminers ||
                                                "____"}
                                        </p>

                                        <p className="mb-12">
                                            I wish him/her every success in
                                            life.
                                        </p>

                                        <div className="mt-24 text-right">
                                            <div className="font-bold">
                                                Controller of Examinations
                                            </div>
                                            <div className="font-bold">
                                                Panskura Banamali College
                                            </div>
                                            <div className="font-bold">
                                                (Autonomous)
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
            </CardContent>
        </Card>
    </div>
)}
          {/* Part of moderetor cirtificate */}

{display === "mod" && (
    <div>
        {/* Moderator-specific content */}
        <Card>
            <CardHeader>
                <CardTitle>Moderator Form</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 gap-8"> 
                        {/* Form Section - Left Side */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Certificate Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>   
                                        <Label>Memo Number</Label>
                                        <Input
                                            name="memoNumber"
                                            value={formData.memoNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Moderator Name</Label>
                                        <Input
                                            name="examinerName"
                                            value={formData.examinerName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Designation</Label>
                                            <Select
                                                value={
                                                    formData.examinerDesignation
                                                }
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        examinerDesignation:
                                                            value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select designation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SACT">
                                                        SACT
                                                    </SelectItem>
                                                    <SelectItem value="Professor">
                                                        Professor
                                                    </SelectItem>
                                                    <SelectItem value="Associate Professor">
                                                        Associate Professor
                                                    </SelectItem>
                                                    <SelectItem value="Assistant Professor">
                                                        Assistant Professor
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Department</Label>
                                            <Input
                                                name="examinerDept"
                                                value={formData.examinerDept}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="space-y-2">
                                            <Label>Institution</Label>
                                            <Select
                                                value={
                                                    formData.institution
                                                }
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        institution:
                                                            value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select institution" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="College">
                                                        College
                                                    </SelectItem>
                                                    <SelectItem value="University">
                                                        University
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                     </div> */}

                                    <div className="space-y-2">
                                        <Label>College</Label>
                                        <Input
                                            name="examinerCollege"
                                            value={formData.examinerCollege}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                            <Label>Exam Type</Label>
                                            <Select
                                                value={
                                                    formData.examType
                                                }
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        examType:
                                                            value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select exam type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Theory">
                                                        Theory
                                                    </SelectItem>
                                                    <SelectItem value="Practical">
                                                        Practical
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                     </div>

                                    {/* <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Textarea
                                            name="examinerAddress"
                                            value={formData.examinerAddress}
                                            onChange={handleChange}
                                        />
                                    </div> */}
                                    <div className="space-y-2">
                                        <Label>Year</Label>
                                        <Input
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label>Semester</Label>
                                            {/* <Input
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                    /> */}
                                            <Select
                                                value={formData.semester}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        semester: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select semester" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="I">
                                                        I
                                                    </SelectItem>
                                                    <SelectItem value="II">
                                                        II
                                                    </SelectItem>
                                                    <SelectItem value="III">
                                                        III
                                                    </SelectItem>
                                                    <SelectItem value="IV">
                                                        IV
                                                    </SelectItem>
                                                    <SelectItem value="V">
                                                        V
                                                    </SelectItem>
                                                    <SelectItem value="VI">
                                                        VI
                                                    </SelectItem>
                                                    <SelectItem value="VII">
                                                        VII
                                                    </SelectItem>
                                                    <SelectItem value="VIII">
                                                        VIII
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Degree</Label>
                                            <Select
                                                value={formData.degree}
                                                onValueChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        degree: value,
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select degree" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UG">
                                                        UG
                                                    </SelectItem>
                                                    <SelectItem value="PG">
                                                        PG
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subject</Label>
                                            <Input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Paper</Label>
                                            <Input
                                                name="paper"
                                                value={formData.paper}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date </Label>
                                            <Input
                                                name="dateOfExam"
                                                value={formData.dateOfExam}
                                                onChange={handleChange}
                                            />
                                        </div>
                                       {/* <div className="space-y-2">
                                            <Label>Time of Exam</Label>
                                            <Input
                                                name="timeOfExam"
                                                value={formData.timeOfExam}
                                                onChange={handleChange}
                                            />
                                        </div> */}
                                    </div>

                                    {/* <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Number of Students</Label>
                                            <Input
                                                name="numberOfStudents"
                                                value={
                                                    formData.numberOfStudents
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Number of Examiners</Label>
                                            <Input
                                                name="numberOfExaminers"
                                                value={
                                                    formData.numberOfExaminers
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div> */}
                                </CardContent>
                            </Card>

                            {/* Email Section */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                         Certificate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {/* <Label>Recipient Email</Label> */}
                                        {/* <Input
                                            type="email"
                                            placeholder="Enter recipient email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        /> */}
                                    </div>
                                    <div className="flex gap-2">
                                        {/* <Button
                                            onClick={handleSendEmail}
                                            disabled={isSending || !email}
                                            className="flex items-center gap-2"
                                        >
                                            <Mail className="h-4 w-4" />
                                            {isSending
                                                ? "Sending..."
                                                : "Send Certificate"}
                                        </Button> */}
                                        <Button
                                            variant="outline"
                                            onClick={handleDownloadPDF}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Certificate Preview - Right Side */}
                        <div className="sticky top-4 h-fit">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">
                                        Certificate Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        ref={certificateRef}
                                        className="p-8 bg-white text-black mx-auto"
                                        style={{
                                            width: "210mm",
                                            minHeight: "297mm",
                                            fontFamily:
                                                "Times New Roman, serif",
                                            fontSize: "14px",
                                            lineHeight: "1.6",
                                            padding: "20mm",
                                            border: "1px solid #e5e5e5",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        <div className="text-right text-xs">
                                            Phone: 03228-252222(Principal)
                                        </div>
                                        {/* College Logo and Header */}
                                        <div className="flex items-start justify-start mb-4 gap-8 border-b-4 border-b-slate-900 ">
                                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                                <img src="data:image/jpeg;base64,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" />
                                            </div>
                                            <div>
                                                <div className="text-center font-bold text-2xl mb-1">
                                                    PANSKURA BANAMALI COLLEGE
                                                </div>
                                                <div className="text-center">
                                                    (AUTONOMOUS COLLEGE : 2018-2019 to 2027-2028)  
                                                </div>
                                                <div className="text-center text-1xl mb-1">
                                                    (UNDER VIDYASAGAR UNIVERSITY)
                                                </div>
                                                <div className="text-center text-sm mb-4">
                                                    Largest Rural Based, NAAC
                                                    Re-accredited 'A' Grade
                                                    (2016-2021)
                                                    <br />
                                                    DST-FIST (Govt. of India), BOOST-DBT(Govt. of India)
                                                    Sponsored College
                                                    <br />
                                                    P.O. - Panskura R.S., PIN -
                                                    721152, Purba Medinipur,
                                                    West Bengal, India
                                                    <br />
                                                    Website:
                                                    www.panskurabanamalicollege.org
                                                    | E-mail:
                                                    principal.pbc@gmail.com
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-row justify-between" >
                                        <div className="flex justify-end mb-2 text-sm">
                                            Memo Number:{" "}
                                            {formData.memoNumber || "____"}
                                        </div>

                                        <div className="flex justify-end mb-6 text-sm">
                                            Date:{" "}
                                            {formData.dateOfExam || "____"}
                                        </div>
                                        </div>

                                        <h2 className="text-center font-bold mb-4 underline">
                                            To Whom It May Concern
                                        </h2>

                                        <p className="mb-4 text-justify">
                                            This is to certify that{" "}
                                            <b>
                                                {formData.examinerName ||
                                                    "____"}
                                            </b>{" "}
                                            (
                                            {formData.examinerDesignation ||
                                                "____"}
                                            ) Dept. of{" "}
                                            {formData.examinerDept || "____"}
                                            , College/University {" "}
                                            {formData.examinerCollege || "____"},
                                            {/* {formData.examinerAddress || "____"} */}
                                             has successfully confidentially the 
                                            moderation of question papers for the 
                                            the End Semester ({formData.examType || "___"})
                                             Examination -{" "}
                                            {formData.year || "____"}, (
                                            {isOddSemester(formData.semester)
                                                ? "Odd Semester"
                                                : "Even Semester"}
                                            ) of Semester –{" "}
                                            {formData.semester || "____"},{" "}
                                            {formData.degree || "____"},
                                            Subject-{" "}
                                            {formData.subject || "____"},
                                            Paper- {formData.paper || "____"}{" "}
                                            on {formData.dateOfExam || "____"} 
                                            {/*({formData.timeOfExam || "____"})  */} 
                                             at this college.
                                        </p>

                                        {/* <p className="mb-2">
                                            Number of Students appeared in the
                                            said examination:{" "}
                                            {formData.numberOfStudents ||
                                                "____"}
                                        </p>
                                        <p className="mb-6">
                                            Number of Examiners involved in the
                                            said examination:{" "}
                                            {formData.numberOfExaminers ||
                                                "____"}
                                        </p> */}

                                        <p className="mb-12">
                                            I wish him/her every success in
                                            life.
                                        </p>

                                        <div className="mt-24 text-right">
                                            <div className="font-bold">
                                                Controller of Examinations
                                            </div>
                                            <div className="font-bold">
                                                Panskura Banamali College
                                            </div>
                                            <div className="font-bold">
                                                (Autonomous)
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
            </CardContent>
        </Card>
    </div>
)}

                  
    </section>
            )}

    {role == "external" && (
        <div className="sticky top-4 h-fit">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">
                        Certificate Preview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        ref={certificateRef}
                        className="p-8 bg-white text-black mx-auto"
                        style={{
                            width: "210mm",
                            minHeight: "297mm",
                            fontFamily: "Times New Roman, serif",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            padding: "20mm",
                            border: "1px solid #e5e5e5",
                            boxSizing: "border-box",
                        }}
                    >
                        <div className="text-right text-xs">
                            Phone: 03228-252222(Principal)
                        </div>

                        <div className="flex items-start justify-start mb-4 gap-8 border-b-4 border-b-slate-900 ">
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                                <img src="data:image/jpeg;base64,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" />
                            </div>
                            <div>
                                <div className="text-center font-bold text-2xl mb-2">
                                    PANSKURA BANAMALI COLLEGE
                                </div>
                                <div className="text-center">
                                    (AUTONOMOUS COLLEGE : 2018-2019 to 2027-2028)  
                                </div>
                                <div className="text-center text-1xl mb-1">
                                    (UNDER VIDYASAGAR UNIVERSITY)
                                </div>
                                <div className="text-center text-sm mb-4">
                                    Largest Rural Based, NAAC
                                    Re-accredited 'A' Grade (2016-2021)
                                    <br />
                                    DST-FIST (Govt. of India) Sponsored
                                    College
                                    <br />
                                    P.O. - Panskura R.S., PIN - 721152,
                                    Purba Medinipur, West Bengal, India
                                    <br />
                                    Website:
                                    www.panskurabanamalicollege.org |
                                    E-mail: principal.pbc@gmail.com
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mb-6 text-sm">
                            Date: {formData.dateOfExam || "____"}
                        </div>

                        <h2 className="text-center font-bold mb-4 underline">
                            To Whom It May Concern
                        </h2>

                        <p className="mb-4 text-justify">
                            This is to certify that Mr. Biswajit Laya
                            Professor Dept. of{" "}
                            {formData.examinerDept || "____"},{" "}
                            AAACollege{" "}
                            {formData.examinerAddress || "____"}, has
                            successfully conducted the End Semester
                            (Practical) Examination -{" "}
                            {formData.year || "____"}, Even Semester of
                            Semester – I, UG, Subject- Computer Science,
                            Course- COS-GE1P on 01.04.2025 (10.00 a.m.
                            to 5.00 p.m.) at this college as an external
                            Examiner.
                        </p>

                        <p className="mb-2">
                            Number of Students appeared in the said
                            examination: 20
                        </p>
                        <p className="mb-6">
                            Number of Examiners involved in the said
                            examination: 2
                        </p>

                        <p className="mb-12">
                            I wish him/her every success in life.
                        </p>

                        <div className="mt-24 text-right">
                            <div className="font-bold">
                                Controller of Examinations
                            </div>
                            <div className="font-bold">
                                Panskura Banamali College
                            </div>
                            <div className="font-bold">
                                (Autonomous)
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
            )}
        </>
    );
};

export default CertificateGenerator;