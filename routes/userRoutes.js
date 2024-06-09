import express from 'express'
import userControllers from '../controllers/userControllers.js';

const userRoutes = ()=>{
    const router = express.Router();
    const controllers = userControllers()
    
    router.post('/',controllers.getUserLocation)
    
    // router.get('/get-user',controllers.getUser)
    
    return router
}

export default userRoutes