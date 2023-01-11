import { Router } from 'express'
import { environmentSensors } from "../schema/environmentSchema";
import {environmentHistorySensors} from "../schema/environmentSchema";

//import testInt from "../tools/numberTest";

const router = Router();

const returnBody = (result: any) =>{
    return {
        deviceId: result.body.device_id,
        measured_at: result.body.measured_at,
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

//Gibt die Historischen Daten eines bestimmten Sensors aus
router.get('/historic/:id/last', async (req, res) => {
    const type = req.query.type;
    const value = req.query.value;

    if (!type) {
        return res.status(422).json({ error: 'type Parameter is missing!' });
    }

    if (!value) {
        return res.status(422).json({ error: 'value Parameter is missing!' });
    }

    if (type === 'entries') {
        const result = await environmentHistorySensors.find({'body.device_id': req.params.id}).limit(Number(value));
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'minutes') {
        console.log(type)
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 60 * 1000);
        console.log(date)

        const result = await environmentHistorySensors.find({ 'body.device_id': req.params.id,'body.measured_at': { $gte: +date } });
        console.log(result)
        if (result.length) {

            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'hours') {
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 60 * 60 * 1000);

        const result = await environmentHistorySensors.find({ 'body.device_id': req.params.id, 'body.measured_at': { $gte: +date } });

        if (result.length) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'days') {
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 24 * 60 * 60 * 1000);

        const result = await environmentHistorySensors.find({ 'body.device_id': req.params.id,'body.measured_at': { $gte: +date } });

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    }

    const result = await environmentHistorySensors.find({'body.device_id': req.params.id});
    if (result.length) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ error: 'No Data Found' });
    }
});



export default router;