const  Razorpay = require( "razorpay");
const crypto =require('crypto')
const razorpay = require('../config/razorpay')
const Booking = require('../models/booking.model')
exports.sayHello = async (req, res) => {
  try {
    res.json({ data: "fgvhbjn" });
  } catch (err) {
    res.json(err);
  }
};
exports.createPaymentLink = async (req, res) => {
    console.log(req.params.id)
 
   console.log("created")
 try {
   console.log("dsfffffffffffffffffffffffffffff")
     
     const order = await Booking.findById(req.params.id);
     const paymentLinkRequest = {
       amount:  order.price*100,
       currency: 'INR',
      
      
       reminder_enable: true,
        callback_url: `http://localhost:3000/payment-success`,
       callback_method: 'get',
     };

     const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
 
     const paymentLinkId = paymentLink.id;
     const payment_link_url = paymentLink.short_url;
 
     console.log("orders")

     const resData = {
       paymentLinkId: paymentLinkId,
       payment_link_url,
     };
     res.json({data:resData})
   } catch (error) {
     console.error('Error creating payment link:', error);
res.json(error)
   }


}

exports.order  = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "213ds32",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
  
}

exports.validate = async(req, res)=>{
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} =req.body;
    console.log(req.body);

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    
   
    const data = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
    const digest = data.digest('hex')
   try{
    if(digest!==razorpay_signature){
        console.log(digest)
        return res.status(400).json({msg: "Transaction not legit!"});
    }
   }
   catch(err)
   {console.log(err)
    return res.json({msg:msg})
   }
   data.update(JSON.stringify(req.body))


if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       //We can send the response and store information in a database.

       res.json({
        msg:"success",
        orderId:razorpay_order_id,
        paymentId:razorpay_payment_id

    })

} else {

       res.status(400).send('Invalid signature');

   }
}

