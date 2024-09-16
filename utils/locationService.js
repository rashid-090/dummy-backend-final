import axios from 'axios'
import Decimal from 'decimal.js';
import configKeys from '../config/configKeys.js'
import locationHelpers from './../helpers/locationHelpers.js'

const locationService = {
    getLocationPrice:async(ip,ticketRequestData)=>{
        try {
            let getPrice;
            let total = 0;
            const responseData = {}
            // const fetchedIPData = await axios.post(`https://ipapi.co/${ip}/json`)
            const fetchedIPData = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${configKeys.IP_GEO_LOCATION_API_KEY}&ip=${ip}`)
            
            if(fetchedIPData?.data){
                getPrice = await locationHelpers.getPrice(fetchedIPData.data.currency.code)
            }
            if(!fetchedIPData?.data || !getPrice){
                getPrice = await locationHelpers.getPrice("AED")
            }

            if(!getPrice || !getPrice?.oneWayRate){
                return {status:false,message:"Price not found"}
            }

            
            const passengerCount = parseInt(ticketRequestData.passengerCount)

            if(ticketRequestData.isRoundTrip){
                total = getPrice.roundTripRate
                if(ticketRequestData.serviceType === 'flightwithhotel'){
                    total = getPrice.roundTripHotelRate
                }
                if(ticketRequestData.fastProcess){
                    total = getPrice.roundTripUrgentRate
                }
                if(ticketRequestData.serviceType === 'flightwithhotel' && ticketRequestData.fastProcess){
                    total = getPrice.roundTripUrgentHotelRate
                }
            }else{
                total = getPrice.oneWayRate
                if(ticketRequestData.serviceType === 'flightwithhotel'){
                    total = getPrice.oneWayHotelRate
                }
                if(ticketRequestData.fastProcess){
                    total = getPrice.oneWayUrgentRate
                }
                if(ticketRequestData.serviceType === 'flightwithhotel' && ticketRequestData.fastProcess){
                    total = getPrice.oneWayUrgentHotelRate
                }
            }

            const roundedTotal = new Decimal(total).times(passengerCount).toFixed(2)
            responseData.total = Number(roundedTotal)
            
            responseData.currency = getPrice.currencySymbol
            responseData.originCountry = getPrice.countryName
            
            return {status:true,data:responseData}

        } catch (error) {
            console.error('Error fetching country price',error);
            return {status:false,message:"Internal error"}
        }
    }
}

export default locationService
