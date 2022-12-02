// Die Struktur der Daten die von Mainova gesendet werden.
import mongoose from 'mongoose';

const schema = mongoose.Schema;

interface timeAndData {
    timestamp: string;
    dailyData: [];
}

export interface Data {
    device_id: string;
    body: timeAndData;
}

const parkingHistorySchema = new schema<Data> ({
    device_id: {type: String, required: true},
    body:{type: Object}
})

export const ParkingHistory = mongoose.model<Data>('ParkingHistory', parkingHistorySchema);