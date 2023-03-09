import mongoose from 'mongoose';
import {GenericWsMessage} from "../types/GenericWsMessage";
import {EnvironmentMessage} from "../types/EnvironmentMessage";

const schema = mongoose.Schema;

type Data = GenericWsMessage<EnvironmentMessage>

/*Diese Struktur ist bei allen Sensoren die selbe nur data unterscheidet sich und wird als
eigenes Interface angelegt*/


const environmentSchema = new schema<Data> ({
    event: {type: String, required: true},
    body:{
        parser_id: {type: String, required: true},
        device_id: {type: String, required: true},
        packet_id: {type: String, required: true},
        location: {type: Array, required: false},
        inserted_at: {type: Number, required: true},
        measured_at: {type: Number, required: true},
        data: {
            co: {type: Number, required: true},
            humidity: {type: Number, required: true},
            no2: {type: Number, required: true},
            o3: {type: Number, required: true},
            p10: {type: Number, required: true},
            p25: {type: Number, required: true},
            pressure: { type: Number, required: true},
            so2: {type: Number, required: true},
            temperature: {type: Number, required: true},
        },
        id: {type: String, required: true},
    }
})

export const environmentSensors = mongoose.model<Data>('environmentSensors', environmentSchema);
export const environmentHistorySensors = mongoose.model<Data>('environmentHistorySensors', environmentSchema);