import Websocket from 'ws';
import * as dotenv from 'dotenv';
import { Data } from './schema/parksensorSchema';
import * as mongoose from 'mongoose';
import { update } from './database/parkingData'

dotenv.config();

//Verbindung zu MongoDB aufbauen.
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/mainova').then(() => console.log('Connected to Database'));
}
main().catch((err) => console.log(err));

const apiKey = process.env.API_KEY;
const stream = process.env.STREAM_PARKINGSENSOR;
const parkingSensors = `wss://mainova.element-iot.com/api/v1/streams/${stream}/readings/socket?auth=${apiKey}`;
//const kelsterBoard = `wss://mainova.element-iot.com/api/v1/streams/5b447644-3a7b-49cd-bde1-baf46513ad82/readings/socket?auth=${apiKey}`;

const ws = new Websocket(parkingSensors);
let interval: string | number | NodeJS.Timer | null | undefined = null;

ws.onopen = () => {
    const date = new Date();
    console.log(
        `Connected at:  ${date.toTimeString().split(' ')[0]} - ${date.getDate()}.${
            date.getMonth() + 1
        }.${date.getFullYear()}`
    );
    interval = setInterval(() => {
        const heartbeat = 'ping';
        ws.send(heartbeat);
    }, 30000);
};

ws.on('message', (data) => {
    if (Array.isArray(data) || data.toString() === 'pong') return;
    const result = JSON.parse(data.toString()) as Data[];
    update(result).catch((err) => console.log(err));
    console.log(result[0].body);
});

ws.on('close', () => {
    const date = new Date();
    console.log(
        `Closed at: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${
            date.toTimeString().split(' ')[0]
        }`
    );
    if (interval != null) {
        clearInterval(interval);
        interval = null;
    }
});