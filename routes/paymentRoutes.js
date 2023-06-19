import express from 'express'
import { instance } from "../App.js";
import {config} from 'dotenv'; 
import crypto from 'crypto'
import PaymentModel from "../model/paymentModel.js";

config();

const router = express.Router();

router.post("/checkout",
async (req, res) => {
    const options = {
      amount:Number( req.body.amount * 100),
      currency: "INR",
    };
  
    try {
      const order = await instance.orders.create(options);
      console.log(order);
      res.status(200).json({ success: true ,order});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Payment failed" });
    }
  });
router.post("/paymentVerification",async (req, res) => {
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;
     console.log("razorpay_payment_id top ",razorpay_payment_id)
    const body = razorpay_order_id + "|" + razorpay_payment_id;
  
    const expectedSignature = crypto
    .createHmac("sha256",process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if(isAuthentic){
      //database comes here
        const data = await PaymentModel.create({
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id:razorpay_payment_id,
        razorpay_signature:razorpay_signature
      })
    
     res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`)
  
    }else{
      res.status(200).json({success:false})
    }
  })


export default router; 