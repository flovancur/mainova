import { Router } from 'express';
import { parkingHistorySensors, parkingSensors } from '../schema/parksensorSchema';

const router = Router();

const returnBody = (result: any) => {
        return {
            deviceId: result.body.device_id,
            measured_at: result.body.measured_at,
            p_state: [result.body.data.p_state, ''],
        };
};



//Gibt den aktuellen Status eines ParkSensors aus
router.get('/current/:id', async (req, res) => {
    const result = await parkingSensors.findOne({ 'body.device_id': req.params.id });
    if (result) {
        return res.status(200).json({ data: returnBody(result) });
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

router.get('/historic/:id', async (req, res) => {
    const result = await parkingHistorySensors.find({ 'body.device_id': req.params.id });
    if (result) {
        let historicParking = [];
        for (const resultElement of result) {
            historicParking.push(returnBody(resultElement));
        }
        return res.status(200).json({data: historicParking});
    }else {
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
        const result = await parkingHistorySensors.find({ 'body.device_id': req.params.id }).limit(Number(value)).sort({ _id: -1 });
        if (result) {
            let historicParking = [];
            for (const resultElement of result) {
                historicParking.push(returnBody(resultElement));
            }
            return res.status(200).json({ data: historicParking });
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'minutes') {
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 60 * 1000);

        const result = await parkingHistorySensors.find({
            'body.device_id': req.params.id,
            'body.measured_at': { $gte: +date },
        });
        if (result) {
            let historicParking = [];
            for (const resultElement of result) {
                historicParking.push(returnBody(resultElement));
            }
            return res.status(200).json({ data: historicParking });
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'hours') {
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 60 * 60 * 1000);

        const result = await parkingHistorySensors.find({
            'body.device_id': req.params.id,
            'body.measured_at': { $gte: +date },
        });

        if (result) {
            let historicParking = [];
            for (const resultElement of result) {
                historicParking.push(returnBody(resultElement));
            }
            return res.status(200).json({ data: historicParking });
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    } else if (type === 'days') {
        const date = new Date();
        date.setTime(date.getTime() - Number(value) * 24 * 60 * 60 * 1000);

        const result = await parkingHistorySensors.find({
            'body.device_id': req.params.id,
            'body.measured_at': { $gte: +date },
        });

        if (result) {
            let historicParking = [];
            for (const resultElement of result) {
                historicParking.push(returnBody(resultElement));
            }
            return res.status(200).json({ data: historicParking });
        } else {
            return res.status(404).json({ error: 'No Data Found' });
        }
    }

    const result = await parkingHistorySensors.find({ 'body.device_id': req.params.id });
    if (result) {
        let historicParking = [];
        for (const resultElement of result) {
            historicParking.push(returnBody(resultElement));
        }
        return res.status(200).json({ data: historicParking });
    }else {
        return res.status(404).json({ error: 'No Data Found' });
    }
});

export default router;
