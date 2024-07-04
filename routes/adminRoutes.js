import express from 'express'
import adminControllers from '../controllers/adminControllers.js';
import { uploadTicket } from '../middlewares/cloudinaryConfig.js';

const adminRoutes = ()=>{
    const router = express.Router();
    const controllers = adminControllers()

    router.get('/get-orders',controllers.getOrders)
    router.get('/get-single-order/:orderId',controllers.getSingleOrder)
    router.post('/addPrice',controllers.addPriceByLocation)
    router.put('/updatePrice',controllers.updatePriceByLocation)
    router.patch('/deletePrice',controllers.deletePriceByLocation)
    router.post('/upload-ticket/:orderId',uploadTicket,controllers.uploadTicket)
    router.get('/getPriceList',controllers.getPriceList)
    
    return router
}

export default adminRoutes