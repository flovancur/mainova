import {Data} from "../schema/enviromentSchema";
import {update} from "../database/enviromentData";
import * as dotenv from "dotenv";
import Websocket from "ws";

const websocketEnviroment = () => {

    dotenv.config();

    const apiKey = process.env.API_KEY;
    const stream = process.env.STREAM_ENVIROMENTSENSOR;
    const enviromentSensors = `wss://mainova.element-iot.com/api/v1/streams/${stream}/readings/socket?auth=${apiKey}`;

    const ws = new Websocket(enviromentSensors);
    let intervalEnviroment: string | number | NodeJS.Timer | null | undefined = null;


    ws.onopen = () => {
        const date = new Date();
        console.log(
            `Connected at:  ${date.toTimeString().split(' ')[0]} - ${date.getDate()}.${
                date.getMonth() + 1
            }.${date.getFullYear()}`
        );
        intervalEnviroment = setInterval(() => {
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
        if (intervalEnviroment != null) {
            clearInterval(intervalEnviroment);
            intervalEnviroment = null;
        }
    });
}

export default websocketEnviroment;