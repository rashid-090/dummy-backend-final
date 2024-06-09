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
        baseRate: {
            type: Number,
            required: true
        },
        roundTripRate: {
            type: Number,
            required: true
        },
        flightWithHotelSurCharge: {
            type: Number,
            required: true
        },
        fastProcessSurCharge: {
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

