// Die Struktur der Daten die von Mainova gesendet werden.
import mongoose from 'mongoose';

const schema = mongoose.Schema;

interface timeAndData {
    date: String;
    dailyData: {
        parser_id: String;
        device_id: String;
        packet_id: String;
        location: null;
        inserted_at: String;
        measured_at: String;
        data: {
            map_state: Number;
            message_type: String;
            p_state: String;
        };
    }[];
}

export interface Data {
    device_id: string;
    body: timeAndData;
}

const parkingHistorySchema = new schema<Data>({
    device_id: { type: String, required: true },
    body: { type: Object },
});

export const parkingHistory = mongoose.model<Data>('parkingHistory', parkingHistorySchema);
