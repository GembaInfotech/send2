const ParkingModel = require("../../models/parking.model");

exports.getParkingByGuardId = async (req, res) => {
    try {
        const guardId = req.params.guard_id; // Assuming the guard ID is passed as req.params.guardId
        console.log(guardId);
        // Find all parkings associated with the given guard ID
        console.log(guardId);
        const parkings = await ParkingModel.find({ guard_id: guardId });
        console.log(parkings);

        res.status(200).json({ success: true, message: 'Parkings retrieved successfully', parkings: parkings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving parkings', error: error.message });
    }
};
