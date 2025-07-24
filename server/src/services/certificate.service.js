// import { Certificate } from "../model/certificate.model.js";
import { NormalUser } from "../model/normaluser.model.js";
import { Certificate } from "../model/certificate.model.js";
import { Users } from "../model/user.model.js";
// import { NormalUser } from "../model/normaluser.model.js";

class CertificateService {  
    async createCertificate({
        id, // creator's ID (authenticated user)
        memoNumber,
        userID,
        role,
        designation,
        department,
        institutionName,
        subject,
        address,
        examType,
        year,
        semester,
        degree,
        paperCode,
        paperName,
        studentsNo,
        examinersNo,
        dateOfExamination,
        timeOfExamination,
        status,
        CertificateType,
        nonExistUser ,
        honorifics,
        gender,
        institutionType,
        examStartTime,
        examEndTime,
    }) {
        try {
            let userRefId = null;
            let userModel = "";

            if (role==="external") {
                
                const systemUser = await Users.findById(id);
                userRefId = systemUser._id;
                userModel = "user";
                
            }else if(role==="hod"){
                if (nonExistUser.length > 0) {
                    let normalUser = await NormalUser.findOne({
                        name:nonExistUser,
                    });
    
                    if (!normalUser) {
                        normalUser = await NormalUser.create({
                            name:nonExistUser,
                        });
                    }
    
                    userRefId = normalUser._id;
                    userModel = "normaluser";
                }
                else if (userID) {
                    const systemUser = await Users.findById(userID);
                    if (systemUser) {
                        userRefId = systemUser._id;
                        userModel = "user";
                    } else {
                        const normalUser = await NormalUser.findById(userID);
                        if (normalUser) {
                            userRefId = normalUser._id;
                            userModel = "normaluser";
                        } else {
                            throw new Error(
                                "Provided userID not found in either user or normaluser."
                            );
                        }
                    }
                }  
    
            }

            // if (nonExistUser.length > 0) {
            //     const { name, email, phoneNo } = nonExistUser[0]; 
            //     let normalUser = await NormalUser.findOne({
            //         name,
            //         email,
            //     });

            //     if (!normalUser) {
            //         normalUser = await NormalUser.create({
            //             name,
            //             email,
            //             phoneNo,
            //         });
            //     }

            //     userRefId = normalUser._id;
            //     userModel = "normaluser";
            // }

            // ✅ 2. Handle if userID is sent instead
            // else if (userID) {
            //     const systemUser = await Users.findById(userID);
            //     if (systemUser) {
            //         userRefId = systemUser._id;
            //         userModel = "user";
            //     } else {
            //         const normalUser = await NormalUser.findById(userID);
            //         if (normalUser) {
            //             userRefId = normalUser._id;
            //             userModel = "normaluser";
            //         } else {
            //             throw new Error(
            //                 "Provided userID not found in either user or normaluser."
            //             );
            //         }
            //     }
            // }  
            // else if (id) {
            //     const systemUser = await Users.findById(id);
            //     if (systemUser) {
            //         userRefId = systemUser._id;
            //         userModel = "user";
            //     } else {
            //         const normalUser = await NormalUser.findById(id);
            //         if (normalUser) {
            //             userRefId = normalUser._id;
            //             userModel = "normaluser";
            //         } else {
            //             throw new Error(
            //                 "Provided userID not found in either user or normaluser."
            //             );
            //         }
            //     }
            // } else {
            //     throw new Error(
            //         "Either userID or nonExistUser must be provided."
            //     );
            // }


            // ✅ Create certificate
           
            const certificate = await Certificate.create({
                creator: id, // creator is always from `user` collection
                memoNumber,
                user: userRefId,
                userModel,
                designation,
                department,
                institutionName,
                address,
                examType,
                year,
                semester,
                degree,
                paperCode,
                paperName,
                studentsNo,
                examinersNo,
                dateOfExamination,
                timeOfExamination,
                status,
                CertificateType,
                honorifics,
                gender,
                institutionType,
                subject,
                examStartTime,
                examEndTime,
            });

            return certificate;
        } catch (error) {
            console.error("Certificate creation failed:", error.message);
            throw new Error(error.message);
        }
    }

    async showCertificates() {
        try {
            const certificates = await Certificate.find()

            return certificates;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async showExternalCertificates(id) {
        try {
            const certificates = await Certificate.find({user:id ,userModel:"user"})

            return certificates;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateCertificate({
        _id,
            memoNumber,
            address,
            creator,
            user,
            honorifics,
            userModel,
            CertificateType,
            designation,
            department,
            institutionType,
            institutionName,
            degree,
            semester,
            subject,
            paperName,
            dateOfExamination,
            examStartTime,
            examEndTime,
            gender,
            studentsNo,
            examinersNo,
            examType,
            nonExistUser,
            status,
            createdAt,
    }) {
        try {
            // Step 1: Fetch the certificate
            const existingCertificate = await Certificate.findById(
                _id
            );
            console.log("existingCertificate=>", existingCertificate);

            if (!existingCertificate) {
                throw new Error("Certificate not found.");
            }

            // Step 2: Block updates if status is 'accept'
            if (existingCertificate.status === "accept") {
                throw new Error("Cannot update an accepted certificate.");
            }

            // Step 3: Build update payload conditionally
            const updateData = {
                memoNumber,
                address,
                creator,
                honorifics,
                CertificateType,
                designation,
                department,
                institutionType,
                institutionName,
                degree,
                semester,
                subject,
                paperName,
                dateOfExamination,
                examStartTime,
                examEndTime,
                gender,
                studentsNo,
                examinersNo,
                examType,
            };

            // Step 4: Apply update
            const updatedCertificate = await Certificate.findByIdAndUpdate(
                _id,
                updateData,
                { new: true, runValidators: true }
            );

            return updatedCertificate;
        } catch (error) {
            console.error("Error updating certificate:", error.message);
            throw new Error(error.message);
        }
    }

    async updateCertificatestatus(certificateId, memoNumber, status) {
        console.log("updateCertificatestatus");

        try {
            const certificate = await Certificate.findByIdAndUpdate(
                certificateId,
                { memoNumber, status },
                { new: true, runValidators: true }
            );
            if (!certificate) {
                throw new Error("Certificate not exist");
            }
            return certificate;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCertificate(id) {
        const certificate = await Certificate.findByIdAndDelete(id);
        return certificate;
    }
}

export default new CertificateService();
