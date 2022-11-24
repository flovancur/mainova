// Die Struktur der Daten die von Mainova gesendet werden.

export interface Data {
    event: 'reading_added';
    body: MessageData;
}

/*Diese Struktur ist bei allen Sensoren die selbe nur data unterscheidet sich und wird als
eigenes Interface angelegt*/
interface MessageData {
    parser_id: string;
    device_id: string;
    packet_id: string;
    location: never | null;
    inserted_at: string;
    measured_at: string;
    data: ParkingSensor;
    id: string;
}

interface ParkingSensor {
    map_state: number;
    message_type: string;
    p_state: string;
}
