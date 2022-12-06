import { Router } from 'express'
import {ParkingSensors} from "../schema/parksensorSchema";
import {ParkingHistory} from "../schema/parkingHistorySchema";
import testInt from "../tools/numberTest";

const router = Router();

//Gibt alle aktuellen Daten der Parksensoren aus
router.get('/current', async (_req, res) => {
        const result = await ParkingSensors.find();
        if (result) {
            let currentParking = [];
            for (const resultElement of result) {
                currentParking.push({
                    deviceID: resultElement.body.device_id,
                    data: {state: resultElement.body.data.p_state},
                    measured_at: resultElement.body.measured_at,
                })
            }
            return res.status(200).json({currentParking});
        } else {
            return res.status(400).json({ error: `No Data found!` });
        }
});

//Gibt den aktuellen Status eines ParkSensors aus
router.get('/current/:id',async (req, res) => {
    const result = await ParkingSensors.findOne({'body.device_id': req.params.id});
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json({ error: `No Id: ${req.params.id} found!` });
    }
});

//Gibt die Historischen Daten eines bestimmten Sensors aus und kann mit 'limit=x' query eingegrenzt werden, wie weit die daten zurückreichen sollen
router.get('/historic/:id',async (req, res) => {
    const limit = req.query.limit;
    if(limit !== undefined){
        if(testInt(limit.toString())){
            const result = await ParkingHistory
                .find({device_id: req.params.id})
                .limit(parseInt(limit.toString()))
                .sort({'body.date': -1});
            if (result) {
                let historicParking = []; // Liste der Daten die nachher ausgegeben werden

                for (const uniqueResult of result) {
                    let dailyResults = [];
                    for( const dailyResult of uniqueResult.body.dailyData){
                        dailyResults.push({
                            measured_at: dailyResult.measured_at,
                            map_state: dailyResult.data.map_state,
                            message_type: dailyResult.data.message_type,
                            p_state: dailyResult.data.p_state
                        });
                    }
                    historicParking.push({
                        deviceID: uniqueResult.device_id,
                        measured_day: uniqueResult.body.date,
                        daily_results: dailyResults,
                    })
                }
                return res.status(200).json(historicParking);
            } else {
                return res.status(400).json({ error: `No Id: ${req.params.id} found!` });
            }
        }else{
            return res.status(400).json({ error: 'limit must be an integer!' });
        }
    }else{
        const result = await ParkingHistory
            .find({device_id: req.params.id})
            .limit(10)
            .sort({'body.date': -1});
        if (result) {
            let historicParking = [];

            for (const uniqueResult of result) {
                let dailyResults = [];
                for( const dailyResult of uniqueResult.body.dailyData){
                    dailyResults.push({
                        measured_at: dailyResult.measured_at,
                        map_state: dailyResult.data.map_state,
                        message_type: dailyResult.data.message_type,
                        p_state: dailyResult.data.p_state
                    });
                }
                historicParking.push({
                    deviceID: uniqueResult.device_id,
                    measured_day: uniqueResult.body.date,
                    daily_results: dailyResults,
                })
            }
            return res.status(200).json(historicParking);
        } else {
            return res.status(400).json({ error: `No Id: ${req.params.id} found!` });
        }
    }
});




export default router;
