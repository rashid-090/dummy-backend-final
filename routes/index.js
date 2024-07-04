import authAdminRoutes from './authAdminRoutes.js'
import authUserRoutes from './authUserRoutes.js'
import adminRoutes from './adminRoutes.js'
import userRoutes from './userRoutes.js';
import priceRoutes from './priceRoutes.js'
import orderRoutes from './orderRoutes.js'
import airportRoutes from './airportRoutes.js'
import authMiddleware from '../middlewares/authMiddleware.js';


const routes = (app)=>{
    app.use('/api/adminAuth',authAdminRoutes());
    app.use('/api/userAuth',authUserRoutes())
    app.use('/api/admin',authMiddleware,adminRoutes());
    app.use('/api/airport',airportRoutes());
    app.use('/api/user',userRoutes());
    app.use('/api/price',priceRoutes());
    app.use('/api/order',orderRoutes());
}

export default routes