const User = require('../../models/user.model');

exports.viewVehicleList = async (req, res) => {
    console.log("helloo");
    const userId = req.userId
    console.log("helloo");
    try {
        console.log("hello");
        const user = await User.findOne({_id:userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null,
            });
        }
        console.log(user);
        const vehicleList = user.vehicle;
        console.log(vehicleList);

        res.status(200).json( vehicleList,
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
