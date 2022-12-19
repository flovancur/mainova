import { Router } from 'express'
import {parkingHistorySensors, parkingSensors} from "../schema/parksensorSchema";
import testInt from "../tools/numberTest";

const router = Router();

const returnBody = (result: any) => {
    return {
        device_id: result.body.device_id,
        measured_at: result.body.measured_at,
        p_state: [result.body.data.p_state, '']
    }
}

//Gibt alle aktuellen Daten der Parksensoren aus
router.get('/current', async (_req, res) => {
        const result = await parkingSensors.find();
        if (result) {
            let currentParking = [];
            for (const resultElement of result) {
                currentParking.push(returnBody(resultElement))
            }
            return res.status(200).json({data: currentParking});
        } else {
            return res.status(404).json({ error: `No Data found!` });
        }
});

//Gibt den aktuellen Status eines ParkSensors aus
router.get('/current/:id',async (req, res) => {
    const result = await parkingSensors.findOne({'body.device_id': req.params.id});
    if (result) {
        return res.status(200).json({data: returnBody(result)
        });
    } else {
        return res.status(404).json({ error: `No Id: ${req.params.id} found!` });
    }
});

//Gibt die Historischen Daten eines bestimmten Sensors aus und kann mit 'limit=x' query eingegrenzt werden, wie weit die Daten zurückreichen sollen in Tagen
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
            const result = await parkingHistorySensors
                .find({'body.device_id': req.params.id,"date":
                        {
                            $gte: new Date((new Date().getTime() - (limit * 24 * 60 * 60 * 1000)))
                        }} )
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
