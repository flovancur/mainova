import { parkingSensors } from '../schema/parksensorSchema';
//Funktion bettet Daten in die Datenbank ein falls bereits vorhanden werden Daten ueberschrieben,
//sonst neu angelegt.

export const update = async (result: any) => {
    const date = new Date();
    await parkingSensors
        .findOneAndUpdate(
            { 'body.device_id': result[0].body.device_id },
            {
                $set: {
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
                },
            },
            {
                upsert: true,
            }
        )
        .then(() => console.log(`Data Added! Device-Id: ${result[0].body.device_id}`));
};
