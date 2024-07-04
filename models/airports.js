import { model, Schema } from "mongoose";


const AirportSchema = new Schema (
    {
        name: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        iataCode: {
            type: String,
            required: true
        }
    }
)

const AirportModel = model('airports', AirportSchema);
export default AirportModel;

