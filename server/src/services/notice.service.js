import { response } from "express";
import { Noticeboard } from "../model/noticeboard.model.js";
// import FileUploader from "../utils/FileUploader.js";
import imagekitService from "./imagekit.service.js";

class NoticeboardService {
    async createNotice(data) {
        const { _id, title, description, bufferFile, originalName } = data;
        try {
            let media = [];
            if (bufferFile != null) {
                const { url, publicId } = await imagekitService.uploadImage(
                    bufferFile,
                    originalName
                );
                media.push({ url: url, public_id: publicId });
            }
            return Noticeboard.create({ title, description, media, user: _id });
        } catch (error) {
            throw new Error("Internal Error");
        }
    }

    async showNotices() {
        try {
            const notices = await Noticeboard.find().sort({ createdAt: -1 });
            return notices;
        } catch (error) {
            throw new Error("Internal Error");
        }
    }

    async updateNotice(id, data) {
        const { title, description, bufferFile, originalName } = data;

        try {
            // Find the existing notice
            const existingNotice = await Noticeboard.findById(id);
            console.log("existingNotice=>>>>", existingNotice);
            console.log("originalName=>>>>", originalName);

            if (!existingNotice) {
                throw new Error("Notice not found");
            }
            let media;

            if (bufferFile != null) {
                const { url, publicId } = await imagekitService.uploadImage(
                    bufferFile,
                    originalName
                );
                media = [{
                    url,
                    public_id: publicId,
                }];
            } else if (existingNotice.media && existingNotice.media.length > 0) {
                media = existingNotice.media;
            } else {
                media = null;
            }
            console.log("existingNotice.media.public_id");
            // console.log(existingNotice.media.public_id);
            // if (existingNotice.media[0].public_id) {
            //     console.log("existingNotice.media.public_id");
            //     console.log(existingNotice.media.public_id);

            //     const respponse1 = imagekitService.deleteImage(
            //         existingNotice.media[0].public_id
            //     );
            //     console.log("response=>>>", respponse1);
            // }
            if (Array.isArray(existingNotice.media) && existingNotice.media.length > 0 && existingNotice.media[0].public_id) {
                console.log("existingNotice.media.public_id", existingNotice.media[0].public_id);
            
                const response1 = await imagekitService.deleteImage(
                    existingNotice.media[0].public_id
                );
                console.log("response=>>>", response1);
            }
            
            // Update notice in database
            const updatedNotice = await Noticeboard.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    media,
                },
                { new: true, runValidators: true }
            );

            if (!updatedNotice) {
                throw new Error("Failed to update notice");
            }

            console.log("Notice updated successfully:", updatedNotice);
            return updatedNotice;
        } catch (error) {
            console.error("Error in updateNotice:", error);
            throw error;
        }
    }

    async deleteNotice(id) {
        try {
            const notice = await Noticeboard.findByIdAndDelete(id);
            if (!notice) {
                throw new Error("Notice not found");
            }

            console.log("Notice deleted:", notice);

            // Delete associated media from Cloudinary
            if (notice.media[0].public_id) {
                imagekitService.deleteImage(notice.media[0].public_id)
            }

            return notice;
        } catch (error) {
            console.error("Error in deleteNotice:", error);
            throw error;
        }
    }
}

export default new NoticeboardService();
