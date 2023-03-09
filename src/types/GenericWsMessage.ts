export interface GenericWsMessage<D> {
    event: 'reading_added';
    body:{
        parser_id: string;
        device_id: string;
        packet_id: string;
        location: never | null;
        inserted_at: number;
        measured_at: number;
        data: D;
        id: string;
    };
}