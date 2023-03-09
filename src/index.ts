import * as dotenv from 'dotenv';
import websocketParking from "./websockets/wsParkingsensors";
import websocketEnvironment from "./websockets/wsEnvironmentSensors";
import parkingRoutes from './routes/parkingRoutes'
import environmentRoutes from "./routes/environmentRoutes";
import mongoose from "mongoose";
import express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './docs/swagger.json'



dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
let hostname = process.env.HOSTNAME || 'localhost';
const url = process.env.DATABASE || 'mongodb://127.0.0.1:27017/mainova';


//Verbindung zu MongoDB aufbauen.
const mainovaDb = async () => {
    mongoose.set("strictQuery", false);
    if(process.env.NODE_ENV !== 'test'){
        await mongoose.connect(url).then(() => console.log('Connected to Database'));
    }else {
        await mongoose.connect('mongodb://127.0.0.1:27017/mainovatest').then(() => console.log('Connected to Test Database'));
    }

}
mainovaDb().catch((err) => console.log(err));


websocketParking(); // Startet die Parking-Websocketverbindung
websocketEnvironment(); // Startet die Environment-Websocketverbindung


app.use(express.json());


const options = {
    swaggerOptions: {
        defaultModelsExpandDepth: -1,
    },
};

app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


app.use('/parking', parkingRoutes);
app.use('/environment', environmentRoutes);





app.listen(port, ()=> console.log(`Server gestartet: http://${hostname}:${port}`));

const closeConnection = () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        mongoose.connection.close().then(() => {
            console.log('Database disconnected!');
        });
    }
    // server.close();
    process.exit();
};

process.on('SIGINT', function () {
    closeConnection();
});
process.on('SIGTERM', function () {
    closeConnection();
});


module.exports = app;

