import * as dotenv from "dotenv";
import {GenericWs} from "./genericWs";
import {GenericWsMessage} from "../types/GenericWsMessage";
import {EnvironmentMessage} from "../types/EnvironmentMessage";
import {environmentHistorySensors, environmentSensors} from "../schema/environmentSchema";

export class WsEnvironmentSensors extends GenericWs<EnvironmentMessage> {
    constructor() {
        dotenv.config();
        const stream = process.env.LINK_ENVIRONMENTSENSOR;
        if (!stream) throw new Error('Missing Env LINK_ENVIRONMENTSENSOR');
        super(stream);
    }

    protected messageParser(bodyData: any): EnvironmentMessage {
        return {
            co: parseInt(String(bodyData.co)),
            humidity: bodyData.humidity,
            no2: bodyData.no2,
            o3: bodyData.o3,
            p10: bodyData.p10,
            p25: bodyData.p25,
            pressure: bodyData.pressure,
            so2: bodyData.so2,
            temperature: bodyData.temperature,
        }
    }

    protected messageHandler(data: GenericWsMessage<EnvironmentMessage>) {
        this.updateEnvironmentSensors(data).catch((err) => console.log(err));
    }

    private async updateEnvironmentSensors(result: GenericWsMessage<EnvironmentMessage>) {
        await environmentSensors.findOneAndUpdate({'body.device_id': result.body.device_id},
            {
                $set:
                result
            },
            {
                upsert: true,
            }
        ).then(() => console.log(`Environment Data Added! Device-Id: ${result.body.device_id}`))

        await environmentHistorySensors.collection.insertOne(
            result
        ).then(() => console.log(`Environment Data Added! Device-Id: ${result.body.device_id}`))
    }

}