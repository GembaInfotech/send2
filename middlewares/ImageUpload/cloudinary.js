const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({ 
  cloud_name: 'di7o64yak', 
  api_key: '395578341736788', 
  api_secret: 'q0YjYx7CGDsVUO1doSMFfFaVfTg' 
});

const uploadImg = (fileToUploads) => {
    console.log("Starting upload process...");

    if (!fileToUploads) {
        console.error("No file specified for upload.");
        return null;
    }

    const filePath = path.join(__dirname, fileToUploads);
    console.log("File path:", filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", filePath);
        return null;
    }

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(filePath, { resource_type: "auto" }, (error, result) => {
            if (error) {
                console.error("Upload error:", error);
                try {
                    fs.unlinkSync(filePath);
                } catch (unlinkError) {
                    console.error("Error deleting file after upload failure:", unlinkError);
                }
                reject(error);
            } else {
                console.log("Upload successful:", result);
                try {
                    fs.unlinkSync(filePath);
                    console.log("File deleted after successful upload.");
                } catch (unlinkError) {
                    console.error("Error deleting file after successful upload:", unlinkError);
                }
                resolve({
                    url: result.secure_url,
                });
            }
        });
    });
};

module.exports = uploadImg;
