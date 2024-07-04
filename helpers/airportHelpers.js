import AirportModel from "../models/airports.js";


const airportHelpers = {
    getAirport:async(searchText)=>{
        const regex = new RegExp(`^${searchText}`, 'i')
        return await AirportModel.find({$or:[{name:regex},{city:regex},{iataCode:regex}]},{name:1,_id:0}).limit(10)
    }
}

export default airportHelpers;