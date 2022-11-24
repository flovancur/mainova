import Websocket from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;
const stream = process.env.STREAM_KELSTERBOARD;

