const cloudinary = require("../config/cloudinary.config");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "upload" },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const uploadMultipleImages = async (files) => {
    if (files && files.length != 0) {
        const uploadPromises = files.map((file) =>
            uploadToCloudinary(file.buffer)
        );
        const results = await Promise.all(uploadPromises);

        return results.map((result) => result.secure_url);
    }
};

module.exports = {
    uploadMultipleImages,
};
