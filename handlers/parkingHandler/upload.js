const ParkingModel = require("../../models/parking.model")
const path = require('path');

exports.upload = async (req, res) => {
    const { id } = req.body; 

    try {
        const parking = await ParkingModel.findById(id);
        if (!parking) {
            return res.status(404).json({ success: false, message: 'Parking not found' });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Please upload images.' });
        }
        if (parking.image.length + req.files.length > 5) {
            return res.status(400).json({ success: false, message: 'You can upload a maximum of 5 images.' });
        }
        req.files.forEach(uploadedFile => {
            parking.image.push(uploadedFile.filename); 
        });
        await parking.save(); 

        res.status(200).json({
            success: true,
            message: 'Images uploaded and saved successfully!',
            images: parking.image 
        });

    } catch (error) {
        console.error(error); 
        res.status(500).json({ success: false, message: 'Error uploading parking images', error: error.message });
    }
};
