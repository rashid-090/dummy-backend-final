import locationPriceModel from "../models/locationPrice.js";


const locationHelpers = {
    getPrice: async (currencySymbol) => {
        return await locationPriceModel.findOne({ isValid:true,currencySymbol }, { isValid:0,__v: 0})
    },
    checkPriceExists:async(countryName,currencySymbol)=>{
        return await locationPriceModel.findOne(
            { 
                isValid:true,
                $or: [
                    { countryName },
                    { currencySymbol }
                ]
            },
            { isValid:0,__v: 0}
        )
    },
    addPriceByCountry: async (
        countryName,
        currencySymbol,
        baseRate,
        roundTripRate,
        flightWithHotelSurCharge,
        fastProcessSurCharge
    ) => {
        const newCountry = new locationPriceModel({
            countryName,
            currencySymbol,
            baseRate,
            roundTripRate,
            flightWithHotelSurCharge,
            fastProcessSurCharge
        })

        return await newCountry.save()
    },
    updatePriceByCountry:async(_id,updatedPrices)=>{
        return await locationPriceModel.findOneAndUpdate({_id,isValid:true},{$set:updatedPrices},{new: true, projection: {isValid:0,__v:0}})
    },
    deleteAPrice:async(_id)=>{
        return await locationPriceModel.updateOne({_id,isValid:true},{$set:{isValid:false}})
    },
    getPriceList:async()=>{
        return await locationPriceModel.find({isValid:true},{isValid:0,__v:0}).sort({countryName:1})
    }
}

export default locationHelpers;