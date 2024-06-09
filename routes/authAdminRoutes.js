import express from 'express';
import authAdminControllers from '../controllers/authAdminControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const authAdminRoutes = () => {
    const router = express.Router();
    const controllers = authAdminControllers();

    router.post('/signup',controllers.signUp)
    router.post('/signin',controllers.signIn)
    router.delete('/signout',authMiddleware, controllers.signOut);

    return router;
}

export default authAdminRoutes;