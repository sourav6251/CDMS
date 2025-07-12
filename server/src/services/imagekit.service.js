import imagekit from "../config/imagekit.config.js";
class ImageKitService {
    async uploadImage(file, fileName) {
        console.log("Enter into uploadImage method with file:", file);
    
        try {
            // Extract first 5 characters from fileName (without extension)
            // const nameWithoutExt = fileName.split('.').slice(0, -1).join('.') || "image";
            // const extension = fileName.split('.').pop();
            // const truncatedName = nameWithoutExt.substring(0, 5) + '.' + extension;
    
            let response = await imagekit.upload({
                file: file,
                fileName: fileName,
                folder: "/Collage",
            });
    
            return {
                url: response.url,
                publicId: response.fileId,
            };
        } catch (error) {
            throw new Error("Image upload failed: " + error.message);
        }
    }
    
    async deleteImage(publicId) {
        try {
            const response = await imagekit.deleteFile(publicId);
            return response;
        } catch (error) {
            throw new Error("Image deletion failed: " + error.message);
        }
    }
}

export default new ImageKitService();
