import {Data} from "../schema/parksensorSchema";
import {update} from "../database/parkingData";
import * as dotenv from "dotenv";
import Websocket from "ws";

const websocket = () => {

    dotenv.config();

    const apiKey = process.env.API_KEY;
    const stream = process.env.STREAM_PARKINGSENSOR;
    const parkingSensors = `wss://mainova.element-iot.com/api/v1/streams/${stream}/readings/socket?auth=${apiKey}`;

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

    // wenn ein Sensor eine Nachricht schickt:
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
}

export default websocket;