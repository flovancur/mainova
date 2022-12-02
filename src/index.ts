import * as dotenv from 'dotenv';
import websocket from "./websockets/ws_parkingsensors";
import parkingRoutes from './routes/parkingRoutes'
import mongoose from "mongoose";
import express from 'express';
import History from './requests/parksensorsHistory'


dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
let hostname = process.env.HOSTNAME || 'localhost';

History();


//Verbindung zu MongoDB aufbauen.
const mainovaDb = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mainova').then(() => console.log('Connected to Database'));
}
mainovaDb().catch((err) => console.log(err));


websocket(); // Startet die Websocketverbindung


app.use(express.json());



app.use('/', parkingRoutes);

app.listen(port, ()=> console.log(`Server gestartet: http://${hostname}:${port}`));

