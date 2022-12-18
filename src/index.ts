import * as dotenv from 'dotenv';
import websocketParking from "./websockets/wsParkingsensors";
import websocketEnviroment from "./websockets/wsEnviromentSensors";
import parkingRoutes from './routes/parkingRoutes'
import enviromentRoutes from "./routes/enviromentRoutes";
import mongoose from "mongoose";
import express from 'express';
// import * as swaggerUi from 'swagger-ui-express';
//import * as swaggerDocument from './docs/swagger.json';



dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
let hostname = process.env.HOSTNAME || 'localhost';
const url = process.env.DATABASE || '127.0.0.1:27017';




//Verbindung zu MongoDB aufbauen.
const mainovaDb = async () => {
    await mongoose.connect(`mongodb://${url}/mainova`).then(() => console.log('Connected to Database'));
}
mainovaDb().catch((err) => console.log(err));


websocketParking(); // Startet die Parking-Websocketverbindung
websocketEnviroment(); // Startet die Enviroment-Websocketverbindung


app.use(express.json());

app.use('/mainova/parking', parkingRoutes);
app.use('/mainova/enviroment', enviromentRoutes);

/*app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
const server = app.listen(port, () => {
    console.log('Server gestartet: http://' + hostname + ':' + port);
});*/


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


