import locationHelpers from "../helpers/locationHelpers.js"
import orderHelpers from "../helpers/orderHelpers.js"
import vine,{errors} from '@vinejs/vine'


const adminControllers = () => {
    const addPriceByLocation = async (req, res) => {
        const schema = vine.object({
            countryName:vine.string().minLength(3).maxLength(50),
            currencySymbol:vine.string().fixedLength(3),
            oneWayRate:vine.string().minLength(1).maxLength(10),
            oneWayUrgentRate:vine.string().minLength(1).maxLength(10),
            oneWayHotelRate:vine.string().minLength(1).maxLength(10),
            oneWayUrgentHotelRate:vine.string().minLength(1).maxLength(10),
            roundTripRate:vine.string().minLength(1).maxLength(10),
            roundTripUrgentRate:vine.string().minLength(1).maxLength(10),
            roundTripHotelRate:vine.string().minLength(1).maxLength(10),
            roundTripUrgentHotelRate:vine.string().minLength(1).maxLength(10),
        })
        
        try {
            const validator = vine.compile(schema)
            const output = await validator.validate(req.body)
            const {
                countryName,
                currencySymbol,
                oneWayRate,
                oneWayUrgentRate,
                oneWayHotelRate,
                oneWayUrgentHotelRate,
                roundTripRate,
                roundTripUrgentRate,
                roundTripHotelRate,
                roundTripUrgentHotelRate
            } = output
            
            const countryNameCapitalise = countryName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const currencySymbolUpperCase = currencySymbol.toUpperCase()

            const countryExists = await locationHelpers.checkPriceExists(countryNameCapitalise,currencySymbolUpperCase)

            if (countryExists) {
                return res.status(200).json({ status: false, message: "Country already exists" })
            }

            const oneWayRateParsed = parseFloat(oneWayRate)
            const oneWayUrgentRateParsed = parseFloat(oneWayUrgentRate)
            const oneWayHotelRateParsed = parseFloat(oneWayHotelRate)
            const oneWayUrgentHotelRateParsed = parseFloat(oneWayUrgentHotelRate)
            const roundTripRateParsed = parseFloat(roundTripRate)
            const roundTripUrgentRateParsed = parseFloat(roundTripUrgentRate)
            const roundTripHotelRateParsed = parseFloat(roundTripHotelRate)
            const roundTripUrgentHotelRateParsed = parseFloat(roundTripUrgentHotelRate)

            const saveResponse = await locationHelpers.addPriceByCountry(
                countryNameCapitalise,
                currencySymbolUpperCase,
                oneWayRateParsed,
                oneWayUrgentRateParsed,
                oneWayHotelRateParsed,
                oneWayUrgentHotelRateParsed,
                roundTripRateParsed,
                roundTripUrgentRateParsed,
                roundTripHotelRateParsed,
                roundTripUrgentHotelRateParsed,
            )

            if (saveResponse) {
                return res.status(200).json({ status: true, message: "Price saved",data: saveResponse})
            } else {
                return res.status(200).json({ status: false, message: "Country-wise price could not be saved" })
            }
        } catch (error) {
            if(error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({status:false,message:error.messages})
            }
            console.error('Error saving country wise price',error);
            return res.status(500).json({ status: false, message: "Internal error" })
        }
    }

    const updatePriceByLocation = async (req, res) => {
        try {
            const {_id,...updatedPriceListForm} = req.body
            for(const key in updatedPriceListForm){
                if(key !== "countryName" && key !== "currencySymbol"){
                    updatedPriceListForm[key] = parseFloat(updatedPriceListForm[key])
                }
                if(key === "currencySymbol"){
                    updatedPriceListForm[key] = updatedPriceListForm[key].toUpperCase()
                }
                if(key === "countryName"){
                    updatedPriceListForm[key] = updatedPriceListForm[key].split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                }
            }
            
            const updateResponse = await locationHelpers.updatePriceByCountry(_id,updatedPriceListForm)

            if (updateResponse) {
                return res.status(200).json({ status: true, message: "Price updated",data:updateResponse })
            } else {
                return res.status(200).json({ status: false, message: "Price could not be updated" })
            }
        } catch (error) {
            console.error('Error updating price',error);
            return res.status(500).json({ status: false, message: "Internal error" })
        }
    }

    const deletePriceByLocation = async (req, res) => {
        try {
            const {_id} = req.body
            const deleteResponse = await locationHelpers.deleteAPrice(_id)

            if (deleteResponse.modifiedCount) {
                return res.status(200).json({ status: true, message: "Price deleted"})
            } else {
                return res.status(200).json({ status: false, message: "Price could not be deleted" })
            }
        } catch (error) {
            console.error('Error deleting price',error);
            return res.status(500).json({ status: false, message: "Internal error" })
        }
    }

    const getOrders = async(req,res)=>{
        try {
            const allOrders = await orderHelpers.getAllOrders()
            if(allOrders.length){
                return res.status(200).json({ status:true,data:allOrders })
            }
            return res.status(200).json({ status:false,message:"No orders found"})
        } catch (error) {
            console.error("Error fetching orders",error);
            return res.status(500).json({status:false,message:"internal error"})
        }
    }

    const getSingleOrder = async(req,res)=>{
        try {
            const {orderId} = req.params
            const getOrder = await orderHelpers.getAnOrder(orderId)
            if(getOrder){
                return res.status(200).json({ status:true,data:getOrder })
            }
            return res.status(200).json({ status:false,message:"No order found"})
        } catch (error) {
            console.error("Error fetching order",error);
            return res.status(500).json({status:false,message:"internal error"})
        }
    }

    const uploadTicket = async(req,res)=>{
        try {
            const ticketUrl = req.file.path
            const {orderId} = req.params
            
            const uploadResponse = await orderHelpers.uploadInvoice(orderId,ticketUrl)
            if(uploadResponse.modifiedCount){
                return res.status(200).json({status:true,message:"Ticket uploaded",data:ticketUrl})
            }
            
            return res.status(200).json({status:false,message:"Ticket could not be uploaded"})
        } catch (error) {
            console.error("Error uploading invoice",error);
            return res.status(500).json({status:false,message:"Internal server error"})
        }
    }

    const getPriceList = async(req,res)=>{
        try {
            const priceResponse = await locationHelpers.getPriceList()
            if(priceResponse.length){
                return res.status(200).json({status:true,data:priceResponse})
            }
            return res.status(200).json({status:false,message:"No price found"})
        } catch (error) {
            console.error("Error getting price list",error);
            return res.status(500).json({status:false,message:"Internal server error"})
        }
    }

    return {
        addPriceByLocation,
        updatePriceByLocation,
        deletePriceByLocation,
        getOrders,
        getSingleOrder,
        uploadTicket,
        getPriceList
    }
}

export default adminControllers;