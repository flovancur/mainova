import Websocket from 'ws';
import * as dotenv from 'dotenv';
import { Data } from './schema/parksensorSchema';

dotenv.config();

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

ws.on('message', (data) => {
    if (Array.isArray(data) || data.toString() === 'pong') return;
    const dataArray = JSON.parse(data.toString()) as Data[];
    console.log(dataArray);
    const result = dataArray[0].body.data as object;
    console.log(result);
});
