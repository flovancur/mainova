import * as dotenv from "dotenv";
import {GenericWs} from "./genericWs";
import {GenericWsMessage} from "../types/GenericWsMessage";
import {ParksensorWsMessage} from "../types/ParksensorWsMessage";
import {parkingHistorySensors, parkingSensors} from "../schema/parksensorSchema";

export class WsParkingSensors extends GenericWs<ParksensorWsMessage>{
    constructor() {
        dotenv.config();
        const stream = process.env.LINK_PARKINGSENSOR;
        if (!stream) throw new Error('Missing Env LINK_PARKINGSENSOR');
        super(stream);
    }

    protected messageParser(bodyData: any): ParksensorWsMessage {
        return {
            map_state: parseInt(String(bodyData.map_state)),
            message_type: bodyData.message_type,
            p_state: bodyData.p_state,
        };
    }

    protected messageHandler(data: GenericWsMessage<ParksensorWsMessage>) {
        this.updateParkingData(data).catch((err) => console.log(err));
    }

    private async updateParkingData(result: GenericWsMessage<ParksensorWsMessage>) {
        await parkingSensors.findOneAndUpdate({'body.device_id': result.body.device_id},
            {$set:
                result},
            {
                upsert: true,
            }
        ).then(()=>console.log(`Parking Data Added! Device-Id: ${result.body.device_id}`))

        await parkingHistorySensors.collection
            .insertOne(
                result,
            )
            .then(() => console.log(`Parking Data Added to History! Device-Id: ${result.body.device_id}`));
    }

}