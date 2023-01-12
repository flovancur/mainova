import {parkingHistorySensors, parkingSensors} from "../schema/parksensorSchema";
//Funktion bettet Daten in die Datenbank ein falls bereits vorhanden werden Daten ueberschrieben,
//sonst neu angelegt.

const data = (result: any, date: any) =>{
    return {
        event: result[0].event,
            body: {
            parser_id: result[0].body.parser_id,
                device_id: result[0].body.device_id,
                packet_id: result[0].body.packet_id,
                location: result[0].body.location,
                inserted_at: date,
                measured_at: date,
                data: {
                map_state: parseInt(String(result[0].body.data.map_state)),
                    message_type: result[0].body.data.message_type,
                    p_state: result[0].body.data.p_state,
            },
            id: result[0].body.id,
        },
    }
}

export const update = async (result: any) => {
    const date = Date.now();
    await parkingSensors.findOneAndUpdate({'body.device_id': result[0].body.device_id},
        {$set:
        data(result,+date)},
        {
            upsert: true,
        }
    ).then(()=>console.log(`Parking Data Added! Device-Id: ${result[0].body.device_id}`))

    await parkingHistorySensors.collection
        .insertOne(
            data(result, date),
        )
        .then(() => console.log(`Parking Data Added to History! Device-Id: ${result[0].body.device_id}`));
}

