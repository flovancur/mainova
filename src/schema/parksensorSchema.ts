// Die Struktur der Daten die von Mainova gesendet werden.
import mongoose from 'mongoose';

const schema = mongoose.Schema;

export interface Data {
    event: 'reading_added';
    body:{
        parser_id: string;
        device_id: string;
        packet_id: string;
        location: never | null;
        inserted_at: string;
        measured_at: string;
        data: {
            map_state: number;
            message_type: string;
            p_state: string;
        };
        id: string;
    };
}

/*Diese Struktur ist bei allen Sensoren die selbe nur data unterscheidet sich und wird als
eigenes Interface angelegt*/


const parkingSchema = new schema<Data> ({
    event: {type: String, required: true},
    body:{
        parser_id: {type: String, required: true},
        device_id: {type: String, required: true},
        packet_id: {type: String, required: true},
        location: {type: Array, required: false},
        inserted_at: {type: String, required: true},
        measured_at: {type: String, required: true},
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