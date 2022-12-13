import { Router } from 'express';
import { parkingSensors } from '../schema/parksensorSchema';
import { parkingHistory } from '../schema/parkingHistorySchema';
import testInt from '../tools/numberTest';

const router = Router();

//Gibt alle aktuellen Daten der Parksensoren aus
router.get('/current', async (_req, res) => {
    const result = await parkingSensors.find();
    if (result) {
        const currentParking = [];
        for (const resultElement of result) {
            currentParking.push({
                deviceID: resultElement.body.device_id,
                data: { state: resultElement.body.data.p_state },
                measured_at: resultElement.body.measured_at,
            });
        }
        return res.status(200).json({ currentParking });
    } else {
        return res.status(404).json({ error: `No Data found!` });
    }
});

//Gibt den aktuellen Status eines ParkSensors aus
router.get('/current/:id', async (req, res) => {
    const result = await parkingSensors.findOne({ 'body.device_id': req.params.id });
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

//Gibt die Historischen Daten eines bestimmten Sensors aus und kann mit 'limit=x' query eingegrenzt werden, wie weit die Daten zurückreichen sollen in Tagen
router.get('/historic/:id', async (req, res) => {
    const qlimit = req.query.limit;
    let limit;
    if (qlimit !== undefined) {
        if (testInt(qlimit.toString())) {
            limit = parseInt(qlimit.toString());
        } else {
            return res.status(400).json({ error: 'limit must be an integer!' });
        }
    } else {
        limit = 10;
    }
    const result = await parkingHistory.find({ device_id: req.params.id }).limit(limit).sort({ 'body.date': -1 });
    if (result) {
        const historicParking = []; // Liste der Daten die nachher ausgegeben werden

        for (const uniqueResult of result) {
            const dailyResults = [];
            for (const dailyResult of uniqueResult.body.dailyData) {
                dailyResults.push({
                    measured_at: dailyResult.measured_at,
                    map_state: dailyResult.data.map_state,
                    message_type: dailyResult.data.message_type,
                    p_state: dailyResult.data.p_state,
                });
            }
            historicParking.push({
                deviceID: uniqueResult.device_id,
                measured_at: uniqueResult.body.date,
                daily_results: dailyResults,
            });
        }
        return res.status(200).json(historicParking);
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

export default router;
