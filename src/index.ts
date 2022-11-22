import Websocket from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;
const stream = process.env.STREAM_KELSTERBOARD;

const kelsterBoard = `wss://${stream}/readings/socket?auth=${apiKey}`;

const ws = new Websocket(kelsterBoard);

ws.on('open', () => {
    const date = new Date();
    console.log(
        `Connected at: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${
            date.toTimeString().split(' ')[0]
        }`
    );
});

// Funktion um die Verbindung zum Server aufrecht zu erhalten.
function connect_socket() {
    const ws = new Websocket(kelsterBoard);
    ws.on('close', () => {
        const date = new Date();
        console.log(
            `Refreshed at: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${
                date.toTimeString().split(" ")[0]
            }`
        );
        connect_socket();
    });
}

connect_socket();

ws.onmessage = (event) => {
    const message = event.data;
    console.log(message);
};
