const path = require('path')
exports.sendParkingImages = async(req, res) =>{
    console.log("hello");
    
    const { image } = req.params;
    const imagePath = path.join(__dirname,'..','..', 'ProfileImage', 'ParkingImg', image); 
    console.log(imagePath);
    res.sendFile(imagePath, (err) => {
      if (err) {
        res.status(404).send('File not found');
      }
    });
  }