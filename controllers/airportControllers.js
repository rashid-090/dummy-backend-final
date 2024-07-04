import airportHelpers from "../helpers/airportHelpers.js"


const airportControllers = () => {
    const getAirport = async(req,res)=>{
        try {
            const {searchText} = req.query
            const searchResponse = await airportHelpers.getAirport(searchText)
            return res.status(200).json({status:true,data:searchResponse})
        } catch (error) {
            return res.status(500).json({status:false,message:"Internal error"})
        }
    }
    
    return {
        getAirport
    }
}

export default airportControllers;