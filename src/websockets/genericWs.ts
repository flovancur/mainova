import Websocket, {RawData} from "ws";
import {GenericWsMessage} from "../types/GenericWsMessage";
import {parseGenericWsData} from "../tools/parseGenericWsData";

export abstract class GenericWs<D> {
    private ws: Websocket;
    private readonly wsUrl: string;
    private pingInterval: NodeJS.Timer;

    protected constructor(wsUrl: string) {
        this.wsUrl = wsUrl;
        this.connectWs()
    }

    private connectWs() {
        this.ws = new Websocket(this.wsUrl);
        this.initializeEvents();
        this.initializePing();
    }

    /**
     * Internal function that initializes an Interval for keepalive pings
     * @private
     */
    private initializePing() {
        this.pingInterval = setInterval(() => {
            const heartbeat = 'ping';
            this.ws.send(heartbeat);
        }, 30000);
    }


    /**
     * Internal function that initializes all events for the WebSocket connection
     * @private
     */
    private initializeEvents() {
        this.ws.on('message', (data) => this.preMessageHandler(data));
        this.ws.on('close', () => this.disconnectHandler())
        this.ws.onopen = () => this.connectedHandler();
        this.ws.onerror = (error) => console.error('Verbindungsfehler der Enviroment Sensoren:', error)
    }

    /**
     * Parse incoming messages and forward them to handler function
     * @param data RawData that is transmitted by Websocket
     * @private
     */
    private preMessageHandler(data: RawData) {
        if (Array.isArray(data) || data.toString() === 'pong') return;
        const result = JSON.parse(data.toString())[0];
        const parsedMessage = parseGenericWsData(result, this.messageParser);
        console.log(parsedMessage.body);
        this.messageHandler(parsedMessage);
    }

    /**
     * Internal function called on Websocket Disconnects
     * @private
     */
    private disconnectHandler() {
        //Logging
        const date = new Date();
        console.log(
            `Closed at: ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} - ${
                date.toTimeString().split(' ')[0]
            }`
        );

        //Cleanup Intervals
        clearInterval(this.pingInterval);

        //Reconnect
        setTimeout(this.connectWs,10000)
    }

    /**
     * Internal function called on Websocket connected
     * @private
     */
    private connectedHandler() {
        const date = new Date();
        console.log(
            `Connected at:  ${date.toTimeString().split(' ')[0]} - ${date.getDate()}.${
                date.getMonth() + 1
            }.${date.getFullYear()}`
        );

        // Initialize Ping
        this.initializePing();
    }



    protected abstract messageHandler(data: GenericWsMessage<D>): void;
    protected abstract messageParser(bodyData: any): D;

}