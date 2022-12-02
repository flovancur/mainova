import { Router } from 'express'
import {ParkingSensors} from "../schema/parksensorSchema";

const router = Router();


// GET-Anfrage für einen bestimmten Sensor über sId
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

router.get('/current/:id',async (req, res) => {
    // Checken ob eine Zahl(Integer) eingeben wurde
    const result = await ParkingSensors.findOne({'body.device_id': req.params.id});
    // Wenn das result nicht null ist -> sId gefunden
    if (result) {
        return res.status(200).json(result);
    } else {
        return res.status(400).json({ error: `No Id: ${req.params.id} found!` });
    }
});

export default router;
