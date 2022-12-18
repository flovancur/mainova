import {enviromentHistorySensors, enviromentSensors} from "../schema/enviromentSchema";
//Funktion bettet Daten in die Datenbank ein falls bereits vorhanden werden Daten ueberschrieben,
//sonst neu angelegt.

const data = (result: any,date: any) => {
    return{
        event: result[0].event,
            body: {
            parser_id: result[0].body.parser_id,
                device_id: result[0].body.device_id,
                packet_id: result[0].body.packet_id,
                location: result[0].body.location,
                inserted_at: date,
                measured_at: date,
                data: {
                co: parseInt(String(result[0].body.data.co)),
                    humidity: result[0].body.data.humidity,
                    no2: result[0].body.data.no2,
                    o3: result[0].body.data.o3,
                    p10: result[0].body.data.p10,
                    p25: result[0].body.data.p25,
                    pressure: result[0].body.data.pressure,
                    so2: result[0].body.data.so2,
                    temperature: result[0].body.data.temperature,
            },
            id: result[0].body.id,
        },
    }
}

export const update = async (result: any) => {
    const date = new Date();
    await enviromentSensors.findOneAndUpdate({'body.device_id': result[0].body.device_id},
        {$set:
        data(result,date)},
        {
            upsert: true,
        }
    ).then(()=>console.log(`Enviroment Data Added! Device-Id: ${result[0].body.device_id}`))

    await enviromentHistorySensors.collection.insertOne(
        data(result,date)
    ).then(()=>console.log(`Enviroment Data Added! Device-Id: ${result[0].body.device_id}`))
}

