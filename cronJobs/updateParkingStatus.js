const cron = require('node-cron');
const ParkingModel = require('../models/parking.model')
const updateParkingStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
      const result = await ParkingModel.updateMany(
        { validity_ToDate: { $lt: today } },
        { $set: { status: 'inactive' } }
      );
      // Log based on Mongoose version
      if (result.nModified !== undefined) {
        console.log(`${result.nModified} parking records updated to inactive.`);
      } else if (result.modifiedCount !== undefined) {
        console.log(`${result.modifiedCount} parking records updated to inactive.`);
      } else {
        console.log('No parking records updated.');
      }
    } catch (error) {
      console.error('Error updating parking status:', error);
    }
  };
  
  // Define the cron job
  cron.schedule('0 0 * * *', updateParkingStatus);
  
  // Run a check immediately upon starting the server
  // updateParkingStatus();