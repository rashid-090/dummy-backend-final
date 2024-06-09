import { model, Schema } from "mongoose";


const OrderSchema = new Schema (
    {
        referenceId: {
            type: String,
            required:true
        },
        originCountry: {
            type: String,
            required:true
        },
        currency: {
            type: String,
            required:true
        },
        passengerCount: {
            type: Number,
            required:true
        },
        serviceType: {
            type: String,
            required:true
        },
        tripType: {
            type: String,
            required:true
        },
        processingSpeed: {
            type: String,
            required:true
        },
        journeyLocation: {
            type: Object,
            required:true
        },
        purpose: {
            type: String,
            required:true
        },
        email: {
            type: Object,
            required:true
        },
        mobileNumber: {
            type: Object,
            required:true
        },
        passengerData: {
            type: Array,
            required:true
        },
        date: {
            type: Object,
            required:true
        },
        total: {
            type: Number,
            required:true
        },
        ticketUrl: {
            type: String
        },
        orderStatus: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String
        },
        paymentStatus: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const OrderModel = model('orders', OrderSchema);
export default OrderModel;

