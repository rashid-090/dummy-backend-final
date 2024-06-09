import vine,{errors} from '@vinejs/vine';
import locationService from '../utils/locationService.js'

const priceControllers = () => {
    const getTotal = async(req,res)=>{
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;

        const schema = vine.object({
            passengerCount:vine.number().positive().min(1).max(100).withoutDecimals(),
            serviceType:vine.string().in(["flight","flightwithhotel"]),
            isRoundTrip:vine.boolean(),
            fastProcess:vine.boolean()
        })
        
        try {
            const validator = vine.compile(schema)
            const ticketRequestData = await validator.validate(req.body)
            const locationPriceResponse = await locationService.getLocationPrice(ip,ticketRequestData)
            
            if(locationPriceResponse?.status){
                return res.status(200).json({status:true,data:locationPriceResponse.data})
            }
            return res.status(200).json({status:false,message:"Price could not be fetched"})
        } catch (error) {
            if(error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({status:false,message:error.messages})
            }
            console.error("Error getting price",error);
            return res.status(500).json({status:false,message:"Internal error"})
        }
    }

    return {
        getTotal
    }
}

export default priceControllers;