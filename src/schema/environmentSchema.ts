import mongoose from 'mongoose';

const schema = mongoose.Schema;

export interface Data {
    event: 'reading_added';
    body:{
        parser_id: string;
        device_id: string;
        packet_id: string;
        location: never | null;
        inserted_at: number;
        measured_at: number;
        data: {
            co: number;
            humidity: number;
            no2: number;
            o3: number;
            p10: number;
            p25: number;
            pressure: number;
            so2: number;
            temperature: number;
        };
        id: string;
    };
}

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