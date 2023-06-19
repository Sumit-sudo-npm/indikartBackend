import mongoose from "mongoose";

const paymentSchema = mongoose.Schema({
    razorpay_order_id: {
    type: String,
    required: true,
    unique: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  }
});

const PaymentModel = mongoose.model('Payment', paymentSchema);

export default PaymentModel;
