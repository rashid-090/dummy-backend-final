import express from 'express'
import airportControllers from '../controllers/airportControllers.js';

const airportRoutes = ()=>{
    const router = express.Router();
    const controllers = airportControllers()
    
    router.get('/getAirport',controllers.getAirport)
    
    return router
}

export default airportRoutes