import { model, Schema } from "mongoose";


const locationPriceSchema = new Schema (
    {
        countryName: {
            type: String,
            required: true
        },
        currencySymbol: {
            type: String,
            required: true
        },
        oneWayRate: {
            type: Number,
            required: true
        },
        oneWayUrgentRate: {
            type: Number,
            required: true
        },
        oneWayHotelRate: {
            type: Number,
            required: true
        },
        oneWayUrgentHotelRate: {
            type: Number,
            required: true
        },
        roundTripRate: {
            type: Number,
            required: true
        },
        roundTripUrgentRate: {
            type: Number,
            required: true
        },
        roundTripHotelRate: {
            type: Number,
            required: true
        },
        roundTripUrgentHotelRate: {
            type: Number,
            required: true
        },
        isValid:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)


const locationPriceModel = model('locationPrice', locationPriceSchema);
export default locationPriceModel;

