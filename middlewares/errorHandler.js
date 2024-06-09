import { fileURLToPath } from 'url';
import path, { dirname } from 'path'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const errorHandler = (app) => {
    // Serve index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './../public/errorPage/index.html'));
    });
    
    // app.use((err, req, res, next) => {
    //     console.error(err.stack);
    //     res.status(500).send('Something broke!');
    // });
}

export default errorHandler;