const ParkingModel = require("../../models/parking.model");

exports.getParkingsByVendorId = async (req, res) => {
    try {
        const vendorId = req.params.vendor_id; 
        console.log(vendorId);
        const parkings = await ParkingModel.find({ vendor_id: vendorId });
        console.log(parkings);
        res.json({parkings: parkings});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving parkings', error: error.message });
    }
};
