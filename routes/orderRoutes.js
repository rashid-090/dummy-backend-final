import express from 'express'
import orderControllers from '../controllers/orderControllers.js';

const orderRoutes = () => {
    const router = express.Router();
    const controllers = orderControllers()

    router.post('/create-payment-session', controllers.createPaymentSession)
    router.post('/place-order', controllers.placeAnOrder)
    router.get('/get-order-status/:referenceId', controllers.getOrderStatus)
    router.patch('/update-payment-status', controllers.updateZiinaPayment)

    return router
}

export default orderRoutes