const ParkingModel = require("../../models/parking.model")
const path = require('path');

// Function to upload and update parking images
exports.upload = async (req, res) => {
    const { id } = req.body; // Get parking ID from request body

    try {
        // Find parking by ID
        const parking = await ParkingModel.findById(id);
        if (!parking) {
            return res.status(404).json({ success: false, message: 'Parking not found' });
        }

        // If no files uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload images.' });
        }

        // Check if more than 5 images are already uploaded
        if (parking.image.length + req.files.length > 5) {
            return res.status(400).json({ success: false, message: 'You can upload a maximum of 5 images.' });
        }

        // Add new image paths to parking images
        req.files.forEach(uploadedFile => {
            // const imagePath = path.join('ProfileImage', 'ParkingImg', uploadedFile.filename);
            parking.image.push(uploadedFile.filename); // Add new images
        });

        await parking.save(); // Save updated parking document

        res.status(200).json({
            success: true,
            message: 'Images uploaded and saved successfully!',
            images: parking.image // Return the list of parking images
        });

    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ success: false, message: 'Error uploading parking images', error: error.message });
    }
};
