// Die Struktur der Daten die von Mainova gesendet werden.
import mongoose from 'mongoose';
import {GenericWsMessage} from "../types/GenericWsMessage";
import {ParksensorWsMessage} from "../types/ParksensorWsMessage";

const schema = mongoose.Schema;

type Data = GenericWsMessage<ParksensorWsMessage>

/*Diese Struktur ist bei allen Sensoren die selbe nur data unterscheidet sich und wird als
eigenes Interface angelegt*/


const parkingSchema = new schema<Data> ({
    event: {type: String, required: true},
    body:{
        parser_id: {type: String, required: true},
        device_id: {type: String, required: true},
        packet_id: {type: String, required: true},
        location: {type: Array, required: false},
        inserted_at: {type: Number, required: true},
        measured_at: {type: Number, required: true},
        data: {
            map_state: {type: Number, required: true},
            message_type: {type: String, required: true},
            p_state: {type: String, required: true},
        },
        id: {type: String, required: true},
    }
})

export const parkingSensors = mongoose.model<Data>('parkingSensors', parkingSchema);
export const parkingHistorySensors = mongoose.model<Data>('parkingHistorySensors', parkingSchema);