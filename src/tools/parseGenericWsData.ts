import {GenericWsMessage} from "../types/GenericWsMessage";

export function parseGenericWsData<D>(data: any, dataParser: (bodyData: any) => D): GenericWsMessage<D>  {
    const date = Date.now()

    return {
        event: data.event,
        body: {
            parser_id: data.body.parser_id,
            device_id: data.body.device_id,
            packet_id: data.body.packet_id,
            location: data.body.location,
            inserted_at: date,
            measured_at: date,
            data: dataParser(data.body.data),
            id: data.body.id,
        },
    }
}