import { Router } from 'express'
import { environmentSensors } from "../schema/environmentSchema";
import testInt from "../tools/numberTest";
import {environmentHistorySensors} from "../schema/environmentSchema";
//import testInt from "../tools/numberTest";

const router = Router();

const returnBody = (result: any) =>{
    return {
        deviceId: result.body.device_id,
        measured_at: result.body.measured_at,
        humidity: [`${result.body.data.humidity}`,'%'],
        no2: [`${result.body.data.no2}`,'µg/m³'],
        o3: [`${result.body.data.o3}`,'µg/m³'],
        pm10: [`${result.body.data.p10}`,'µg/m³'],
        pm2_5: [`${result.body.data.p25}`,'µg/m³'],
        pressure: [`${result.body.data.pressure}`,'mbar'],
        so2: [`${result.body.data.so2}`,'µg/m³'],
        temperature: [`${result.body.data.temperature}`,'°C'],
    }
}

//Gibt alle aktuellen Daten der Parksensoren aus
router.get('/current', async (_req, res) => {
    const result = await environmentSensors.find();
    if (result) {
        let currentEnvironment = [];
        for (const resultElement of result) {
            currentEnvironment.push(returnBody(resultElement))
        }
        return res.status(200).json({data: currentEnvironment});
    } else {
        return res.status(404).json({ error: `No Data found!` });
    }
});

router.get('/current/:id',async (req, res) => {
    const result = await environmentSensors.findOne({'body.device_id': req.params.id});
    if (result) {
        return res.status(200).json({data: returnBody(result)});
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

router.get('/historic/:id',async (req, res) => {
    const qlimit = req.query.limit;
    let limit
    if(qlimit!== undefined){
        if(testInt(qlimit.toString())){
            limit = parseInt(qlimit.toString())
        }else{
            return res.status(400).json({ error: 'limit must be an integer!' });
        }}else{
        limit = 10;
    }
    const result = await environmentHistorySensors
        .find({'body.device_id': req.params.id})
        .limit(limit)
        .sort({'body.measured_at': -1});
    if (result) {
        const historicParking = []; // Liste der Daten die nachher ausgegeben werden
        for (const resultElement of result) {
            historicParking.push(returnBody(resultElement))
        }
        return res.status(200).json({result: historicParking});
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});


export default router;