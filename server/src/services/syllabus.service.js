import { Syllabus } from "../model/syllabus.model.js";
import imagekitService from "./imagekit.service.js";

class SyllabusService {
    async createSyllabus(data) {
        const {
            user,
            semester,
            paperCode,
            paperName,
            bufferFile,
            originalName,
        } = data;

        console.log("Creating syllabus with data:", {
            user,
            semester,
            paperCode,
            bufferFile: bufferFile
                ? `File present (${bufferFile.size} bytes)`
                : "No file",
        });

        let mediaInfo = null;

        try {
            if (bufferFile) {
                console.log("Starting file upload...");
                const uploadResult = await imagekitService.uploadImage(
                    bufferFile,
                    originalName
                );

                if (uploadResult.error) {
                    console.error("Upload failed:", uploadResult.error);
                    throw new Error(
                        `File upload failed: ${uploadResult.error}`
                    );
                }

                mediaInfo = {
                    mediaUrl: uploadResult.url,
                    public_id: uploadResult.publicId,
                };
                console.log("File uploaded successfully:", mediaInfo);
            }

            const syllabus = await Syllabus.create({
                user,
                semester,
                paperCode,
                paperName,
                media: mediaInfo ? [mediaInfo] : [],
            });

            console.log("Syllabus created successfully:", syllabus);
            return syllabus;
        } catch (error) {
            console.error("Error in createSyllabus:", error);
            throw error;
        }
    }

    async updateSyllabus(_id, data) {
        const { semester, paperCode, paperName, bufferFile=null, originalName } =
            data;

        console.log("Updating syllabus with data:", {
            _id,
            semester,
            paperCode,
            paperName,
            bufferFile: bufferFile
                ? `File present (${bufferFile.size} bytes)`
                : "No file",
        });

        try {
            // Find the existing syllabus
            const existingSyllabus = await Syllabus.findById(_id);
            if (!existingSyllabus) {
                throw new Error("Syllabus not found");
            }

            let mediaArray = existingSyllabus.media || [];

            // Handle file upload if a new file is provided
            if (bufferFile!=null) {
                console.log("Starting file upload...");
                const uploadResult= await imagekitService.uploadImage(bufferFile,originalName);

                await imagekitService.deleteImage(
                    existingSyllabus.media[0].public_id
                );
                if (uploadResult.error) {
                    console.error("Upload failed:", uploadResult.error);
                    throw new Error(
                        `File upload failed: ${uploadResult.error}`
                    );
                }
                const {publicId,url} = uploadResult;
                // Update media array with new file
                mediaArray = [
                    {
                        mediaUrl: url,
                        public_id: publicId,
                    },
                ];
            }

            // Update syllabus in database
            const updatedSyllabus = await Syllabus.findByIdAndUpdate(
                _id,
                {
                    semester,
                    paperCode,
                    paperName,
                    media: mediaArray,
                },
                { new: true, runValidators: true }
            );

            if (!updatedSyllabus) {
                throw new Error("Failed to update syllabus");
            }

            console.log("Syllabus updated successfully:", updatedSyllabus);
            return updatedSyllabus;
        } catch (error) {
            console.error("Error in updateSyllabus:", error);
            throw error;
        }
    }

    async showSyllabus(semester) {
        console.log("Fetching syllabus for department:", semester);

        try {
            const syllabus = await Syllabus.find({ semester: semester });
            console.log("Syllabus fetched:", syllabus);
            return syllabus || [];
        } catch (error) {
            console.error("Error in showSyllabus:", error);
            throw error;
        }
    }

    async deleteSyllabus(id) {
        try {
            const syllabus = await Syllabus.findByIdAndDelete(id);
            if (!syllabus) {
                throw new Error("Syllabus not found");
            }

            console.log("Syllabus deleted:", syllabus);

            // Delete associated media from Cloudinary
            if (
                syllabus.media &&
                syllabus.media.length > 0 &&
                syllabus.media[0].public_id
            ) {
                console.log("Deleting media:", syllabus.media[0].public_id);
                const deleteResult = await imagekitService.deleteImage(
                    syllabus.media[0].public_id
                );
                console.log("Cloudinary delete result:", deleteResult);
            }

            return syllabus;
        } catch (error) {
            console.error("Error in deleteSyllabus:", error);
            throw error;
        }
    }
}

export default new SyllabusService();


