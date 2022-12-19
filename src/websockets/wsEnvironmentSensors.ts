import {Data} from "../schema/environmentSchema";
import {update} from "../database/environmentData";
import * as dotenv from "dotenv";
import Websocket from "ws";

const websocketEnvironment = () => {

    dotenv.config();

    const stream = process.env.LINK_ENVIRONMENTSENSOR;

    const ws = new Websocket(`${stream}`);
    let intervalEnvironment: string | number | NodeJS.Timer | null | undefined = null;


    ws.onopen = () => {
        const date = new Date();
        console.log(
            `Connected at:  ${date.toTimeString().split(' ')[0]} - ${date.getDate()}.${
                date.getMonth() + 1
            }.${date.getFullYear()}`
        );
        intervalEnvironment = setInterval(() => {
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
        if (intervalEnvironment != null) {
            clearInterval(intervalEnvironment);
            intervalEnvironment = null;
        }
    });
}

export default websocketEnvironment;