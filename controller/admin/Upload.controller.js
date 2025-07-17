const { uploadSingleImages } = require("../../helpers/upload.helper.js");

class uploadController {
    // [POST] /admin/upload/image
    async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded." });
            }
            const url = await uploadSingleImages(req.file);
            if (!url) {
                return res.status(500).json({ error: "Upload failed." });
            }
            console.log("Uploaded image URL:", url);
            return res.status(200).json({ location: url });
        } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new uploadController();
