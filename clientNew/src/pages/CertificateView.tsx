import CertificateGenerator from "@/components/certificate/CertificateGenerator";
import MobileCertificateGenerator from "@/components/certificate/MobileCertificateGenerator";
import { IsMobile } from "@/components/hook/IsMobile";

const CertificateView = () => {
    const isMobile = IsMobile("(max-width: 768px)");
    return isMobile ? (
        <div className="h-full w-full flex flex-col justify-center items-center">
            <MobileCertificateGenerator />
        </div>
    ) : (
        <div className=" w-full  flex justify-center items-center flex-col px-10 ">
            <CertificateGenerator />
        </div>
    );
};

export default CertificateView;
