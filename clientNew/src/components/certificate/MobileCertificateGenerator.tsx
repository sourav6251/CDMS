import React, { useState, useRef, useCallback } from "react";
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
import { useAppSelector } from "@/store/reduxHooks";

interface FormData {
  memoNumber: string;
  examinerName: string;
  examinerDesignation: string;
  examinerDept: string;
  examinerCollege: string;
  examinerAddress: string;
  examType: string;
  year: string;
  semester: string;
  degree: string;
  subject: string;
  course: string;
  paper: string;
  dateOfExam: string;
  timeOfExam: string;
  numberOfStudents: string;
  numberOfExaminers: string;
}

const MobileCertificateGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    memoNumber: "",
    examinerName: "",
    examinerDesignation: "",
    examinerDept: "",
    examinerCollege: "",
    examinerAddress: "",
    examType: "",
    year: "",
    semester: "",
    degree: "",
    subject: "",
    course: "",
    paper: "",
    dateOfExam: "",
    timeOfExam: "",
    numberOfStudents: "",
    numberOfExaminers: "",
  });
  const [display, setDisplay] = useState<"mod" | "ext">("mod");
  const role = useAppSelector((state) => state.user.role);
  const certificateRef = useRef<HTMLDivElement>(null);

  const isOddSemester = useCallback((semester: string): boolean => {
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
    return semNum % 2 === 1;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (name: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleDownloadPDF = useCallback(() => {
    if (certificateRef.current) {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: "certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(caretificateRef.current).set(opt).save();
    }
  }, []);

  const renderForm = (type: "mod" | "ext") => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {type === "mod" ? "Moderator Form" : "External Examiner Form"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memoNumber">Memo Number</Label>
            <Input
              id="memoNumber"
              name="memoNumber"
              value={formData.memoNumber}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examinerName">
              {type === "mod" ? "Moderator Name" : "Examiner Name"}
            </Label>
            <Input
              id="examinerName"
              name="examinerName"
              value={formData.examinerName}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examinerDesignation">Designation</Label>
              <Select
                value={formData.examinerDesignation}
                onValueChange={(value) =>
                  handleSelectChange("examinerDesignation", value)
                }
              >
                <SelectTrigger id="examinerDesignation">
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SACT">SACT</SelectItem>
                  <SelectItem value="Professor">Professor</SelectItem>
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
              <Label htmlFor="examinerDept">Department</Label>
              <Input
                id="examinerDept"
                name="examinerDept"
                value={formData.examinerDept}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="examinerCollege">College</Label>
            <Input
              id="examinerCollege"
              name="examinerCollege"
              value={formData.examinerCollege}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          {type === "ext" && (
            <div className="space-y-2">
              <Label htmlFor="examinerAddress">Address</Label>
              <Textarea
                id="examinerAddress"
                name="examinerAddress"
                value={formData.examinerAddress}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          )}
          {type === "mod" && (
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select
                value={formData.examType}
                onValueChange={(value) => handleSelectChange("examType", value)}
              >
                <SelectTrigger id="examType">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theory">Theory</SelectItem>
                  <SelectItem value="Practical">Practical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleSelectChange("semester", value)}
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {["I", "II", "III", "IV", "V", "VI", "VII", "VIII"].map(
                    (sem) => (
                      <SelectItem key={sem} value={sem}>
                        {sem}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Select
                value={formData.degree}
                onValueChange={(value) => handleSelectChange("degree", value)}
              >
                <SelectTrigger id="degree">
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UG">UG</SelectItem>
                  <SelectItem value="PG">PG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            {type === "mod" && (
              <div className="space-y-2">
                <Label htmlFor="paper">Paper</Label>
                <Input
                  id="paper"
                  name="paper"
                  value={formData.paper}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            )}
            {type === "ext" && (
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            )}
          </div>
          {type === "ext" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfExam">Date of Exam</Label>
                <Input
                  id="dateOfExam"
                  name="dateOfExam"
                  value={formData.dateOfExam}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeOfExam">Time of Exam</Label>
                <Input
                  id="timeOfExam"
                  name="timeOfExam"
                  value={formData.timeOfExam}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          )}
          {type === "ext" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfStudents">Number of Students</Label>
                <Input
                  id="numberOfStudents"
                  name="numberOfStudents"
                  value={formData.numberOfStudents}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfExaminers">Number of Examiners</Label>
                <Input
                  id="numberOfExaminers"
                  name="numberOfExaminers"
                  value={formData.numberOfExaminers}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          )}
          {type === "mod" && (
            <div className="space-y-2">
              <Label htmlFor="dateOfExam">Date</Label>
              <Input
                id="dateOfExam"
                name="dateOfExam"
                value={formData.dateOfExam}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto"
          >
            Download PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderCertificatePreview = (type: "mod" | "ext") => (
    <div className="sticky top-4 h-fit">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Certificate Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={certificateRef}
            className="p-6 bg-white text-black mx-auto"
            style={{
              width: "100%",
              maxWidth: "210mm",
              minHeight: "297mm",
              fontFamily: "Times New Roman, serif",
              fontSize: "12px",
              lineHeight: "1.5",
              padding: "15mm",
              border: "1px solid #e5e5e5",
              boxSizing: "border-box",
            }}
          >
            <div className="text-right text-xs">
              Phone: 03228-252222 (Principal)
            </div>
            <div className="flex flex-col sm:flex-row items-start justify-start mb-4 gap-4 sm:gap-8 border-b-4 border-b-slate-900">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center">
                {/* Placeholder for logo */}
              </div>
              <div className="text-center">
                <div className="font-bold text-lg sm:text-2xl mb-1">
                  PANSKURA BANAMALI COLLEGE
                </div>
                <div className="text-sm sm:text-base">
                  (AUTONOMOUS COLLEGE: 2018-2019 to 2027-2028)
                </div>
                <div className="text-sm sm:text-base mb-1">
                  (UNDER VIDYASAGAR UNIVERSITY)
                </div>
                <div className="text-xs sm:text-sm">
                  Largest Rural Based, NAAC Re-accredited 'A' Grade (2016-2021)
                  <br />
                  DST-FIST (Govt. of India), BOOST-DBT (Govt. of India) Sponsored
                  College
                  <br />
                  P.O. - Panskura R.S., PIN - 721152, Purba Medinipur, West
                  Bengal, India
                  <br />
                  Website: www.panskurabanamalicollege.org | E-mail:
                  principal.pbc@gmail.com
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mb-4 text-xs sm:text-sm">
              <div>Memo Number: {formData.memoNumber || "____"}</div>
              <div>Date: {formData.dateOfExam || "____"}</div>
            </div>
            <h2 className="text-center font-bold text-base sm:text-lg mb-4 underline">
              To Whom It May Concern
            </h2>
            <p className="mb-4 text-justify text-xs sm:text-sm">
              This is to certify that{" "}
              <b>{formData.examinerName || "____"}</b> (
              {formData.examinerDesignation || "____"}) Dept. of{" "}
              {formData.examinerDept || "____"}, {formData.examinerCollege || "____"}
              {type === "ext" && `, ${formData.examinerAddress || "____"}`}, has
              successfully {type === "mod" ? "confidentially moderated the question papers for the" : "conducted the"} End
              Semester ({type === "mod" ? formData.examType || "____" : "Practical"}) Examination -{" "}
              {formData.year || "____"}, (
              {isOddSemester(formData.semester) ? "Odd Semester" : "Even Semester"}
              ) of Semester – {formData.semester || "____"}, {formData.degree || "____"},
              Subject- {formData.subject || "____"},{" "}
              {type === "mod" ? `Paper- ${formData.paper || "____"}` : `Course- ${formData.course || "____"}`}{" "}
              on {formData.dateOfExam || "____"}
              {type === "ext" && ` (${formData.timeOfExam || "____"})`} at this
              college{type === "ext" ? " as an external Examiner" : ""}.
            </p>
            {type === "ext" && (
              <>
                <p className="mb-2 text-xs sm:text-sm">
                  Number of Students appeared in the said examination:{" "}
                  {formData.numberOfStudents || "____"}
                </p>
                <p className="mb-6 text-xs sm:text-sm">
                  Number of Examiners involved in the said examination:{" "}
                  {formData.numberOfExaminers || "____"}
                </p>
              </>
            )}
            <p className="mb-12 text-xs sm:text-sm">
              I wish him/her every success in life.
            </p>
            <div className="mt-12 sm:mt-24 text-right text-xs sm:text-sm">
              <div className="font-bold">Controller of Examinations</div>
              <div className="font-bold">Panskura Banamali College</div>
              <div className="font-bold">(Autonomous)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section className="container py-4 sm:py-6 px-4 sm:px-6 bg-white rounded-md shadow flex flex-col gap-4">
      {role === "hod" && (
        <>
          <Select value={display} onValueChange={setDisplay}>
            <SelectTrigger className="w-full sm:w-[160px] bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mod">Moderator</SelectItem>
              <SelectItem value="ext">External Examiner</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">{renderForm(display)}</div>
            <div className="flex-1 lg:max-w-[210mm]">
              {renderCertificatePreview(display)}
            </div>
          </div>
        </>
      )}
      {role === "external" && (
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Certificate Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={certificateRef}
                className="p-6 bg-white text-black mx-auto"
                style={{
                  width: "100%",
                  maxWidth: "210mm",
                  minHeight: "297mm",
                  fontFamily: "Times New Roman, serif",
                  fontSize: "12px",
                  lineHeight: "1.5",
                  padding: "15mm",
                  border: "1px solid #e5e5e5",
                  boxSizing: "border-box",
                }}
              >
                <div className="text-right text-xs">
                  Phone: 03228-252222 (Principal)
                </div>
                <div className="flex flex-col sm:flex-row items-start justify-start mb-4 gap-4 sm:gap-8 border-b-4 border-b-slate-900">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 flex items-center justify-center">
                    {/* Placeholder for logo */}
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg sm:text-2xl mb-1">
                      PANSKURA BANAMALI COLLEGE
                    </div>
                    <div className="text-sm sm:text-base">
                      (AUTONOMOUS COLLEGE: 2018-2019 to 2027-2028)
                    </div>
                    <div className="text-sm sm:text-base mb-1">
                      (UNDER VIDYASAGAR UNIVERSITY)
                    </div>
                    <div className="text-xs sm:text-sm">
                      Largest Rural Based, NAAC Re-accredited 'A' Grade
                      (2016-2021)
                      <br />
                      DST-FIST (Govt. of India) Sponsored College
                      <br />
                      P.O. - Panskura R.S., PIN - 721152, Purba Medinipur, West
                      Bengal, India
                      <br />
                      Website: www.panskurabanamalicollege.org | E-mail:
                      principal.pbc@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mb-4 text-xs sm:text-sm">
                  Date: {formData.dateOfExam || "____"}
                </div>
                <h2 className="text-center font-bold text-base sm:text-lg mb-4 underline">
                  To Whom It May Concern
                </h2>
                <p className="mb-4 text-justify text-xs sm:text-sm">
                  This is to certify that Mr. Biswajit Laya Professor Dept. of{" "}
                  {formData.examinerDept || "____"}, AAACollege{" "}
                  {formData.examinerAddress || "____"}, has successfully conducted
                  the End Semester (Practical) Examination -{" "}
                  {formData.year || "____"}, Even Semester of Semester – I, UG,
                  Subject- Computer Science, Course- COS-GE1P on 01.04.2025
                  (10.00 a.m. to 5.00 p.m.) at this college as an external
                  Examiner.
                </p>
                <p className="mb-2 text-xs sm:text-sm">
                  Number of Students appeared in the said examination: 20
                </p>
                <p className="mb-6 text-xs sm:text-sm">
                  Number of Examiners involved in the said examination: 2
                </p>
                <p className="mb-12 text-xs sm:text-sm">
                  I wish him/her every success in life.
                </p>
                <div className="mt-12 sm:mt-24 text-right text-xs sm:text-sm">
                  <div className="font-bold">Controller of Examinations</div>
                  <div className="font-bold">Panskura Banamali College</div>
                  <div className="font-bold">(Autonomous)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default MobileCertificateGenerator;