import * as dotenv from 'dotenv';
import websocketParking from "./websockets/wsParkingsensors";
import websocketEnvironment from "./websockets/wsEnvironmentSensors";
import parkingRoutes from './routes/parkingRoutes'
import environmentRoutes from "./routes/environmentRoutes";
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
    await mongoose.connect(url).then(() => console.log('Connected to Database'));
}
mainovaDb().catch((err) => console.log(err));


websocketParking(); // Startet die Parking-Websocketverbindung
websocketEnvironment(); // Startet die Environment-Websocketverbindung


app.use(express.json());

app.use('/parking', parkingRoutes);
app.use('/environment', environmentRoutes);

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


