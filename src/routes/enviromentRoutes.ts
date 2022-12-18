import { Router } from 'express'
import { enviromentSensors } from "../schema/enviromentSchema";
//import testInt from "../tools/numberTest";

const router = Router();

const returnBody = (result: any) =>{
    return {
        deviceID: result.body.device_id,
        measured_at: result.body.measured_at,
        co: [result.body.data.co,'mg/m³'],
        humidity: [result.body.data.humidity,'%'],
        no2: [result.body.data.no2,'µg/m³'],
        o3: [result.body.data.o3,'µg/m³'],
        pm10: [result.body.data.p10,'µg/m³'],
        pm2_5: [result.body.data.p25,'µg/m³'],
        pressure: [result.body.data.pressure,'mbar'],
        so2: [result.body.data.so2,'µg/m³'],
        temperature: [result.body.data.temperature,'°C'],
    }
}

//Gibt alle aktuellen Daten der Parksensoren aus
router.get('/current', async (_req, res) => {
    const result = await enviromentSensors.find();
    if (result) {
        let currentEnviroment = [];
        for (const resultElement of result) {
            currentEnviroment.push(returnBody(resultElement))
        }
        return res.status(200).json({data: currentEnviroment});
    } else {
        return res.status(404).json({ error: `No Data found!` });
    }
});

router.get('/current/:id',async (req, res) => {
    const result = await enviromentSensors.findOne({'body.device_id': req.params.id});
    if (result) {
        return res.status(200).json({data: returnBody(result)});
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

export default router;