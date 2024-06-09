import locationService from './../utils/locationService.js'

const userControllers = () => {

    const getUserLocation = async(req,res)=>{
        const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
        const locationResponse = await locationService.getLocationPrice(ip,{})

        if(locationResponse?.error){

            return res.status(200).json({status:false,message:"Please allow the location access"})
        }else{
            return res.status(200).json({status:true,ip:locationResponse.ip,country_name:locationResponse.country_name,country_code:locationResponse.country_code})
        }
    }
    
    return {
        getUserLocation
    }
}

export default userControllers;