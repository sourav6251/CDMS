import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface PreviewProps {
  data: CertificateFormData;
}

const ExternalCertificatePreview: React.FC<PreviewProps> = ({ data }) => {
  return (
    <div className="mt-8">
      <Card className="border border-gray-300 p-10 shadow-xl text-center bg-white max-w-3xl mx-auto">
        <CardContent>
          <h1 className="text-3xl font-bold mb-2">Examination Duty Certificate</h1>
          <p className="text-sm text-gray-600 mb-6">(For External Examiner)</p>

          <p className="mb-2 text-lg">
            This is to certify that <strong>{data.honorifics} {data.professorName}</strong>, 
            <span> {data.designation},</span> Department of <strong>{data.departmentName}</strong>, 
            from <strong>{data.institutionName}</strong> ({data.institutionType}) was appointed as an 
            external examiner for <strong>{data.subject}</strong> ({data.paperName}) examination for 
            semester <strong>{data.semester}</strong> held on <strong>{data.date}</strong>.
          </p>

          <p className="mb-2 text-lg">
            The examination was conducted from <strong>{data.examStartTime}</strong> to <strong>{data.examEndTime}</strong>.
          </p>

          <p className="mb-2 text-lg">
            Total number of students appeared: <strong>{data.numberOfStudents}</strong>
          </p>

          <p className="mb-2 text-lg">
            Number of examiners present: <strong>{data.numberOfExaminers}</strong>
          </p>

          <p className="mt-8 text-right">Memo No: {data.memoNo}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExternalCertificatePreview;
