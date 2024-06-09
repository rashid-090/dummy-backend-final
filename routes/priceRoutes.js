import express from 'express'
import priceControllers from '../controllers/priceControllers.js';

const priceRoutes = ()=>{
    const router = express.Router();
    const controllers = priceControllers()
    
    router.post('/getTotal',controllers.getTotal)
    
    return router
}

export default priceRoutes