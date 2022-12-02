import * as cron from 'node-cron';
import {ParkingHistory} from "../schema/parkingHistorySchema";
import {ParkingSensors} from "../schema/parksensorSchema";
import axios from 'axios'


const ParkingHistoryData = () => {
    cron.schedule('50 16 * * *', async () => {
        const date = new Date();
        const onlyDate = date.toISOString().split('T')[0];
        const result = await ParkingSensors.find();
        if (result) {
            for (const resultElement of result) {

                const id = resultElement.body.device_id;
                let config = {
                    method: 'get',
                    url: `https://mainova.element-iot.com/api/v1/devices/${id}/readings?limit=10&measured_at=${onlyDate}&auth=2F95D83072A510C35EA541CACC8BAC2F`,
                };

                axios(config)
                    .then(async function (result) {

                            await ParkingHistory.findOneAndUpdate({'body.device_id': result.data.body[0].device_id},
                            {
                                $set:{
                                    device_id: result.data.body[0].device_id,
                                    body: {date: onlyDate, result: result.data.body},
                                }},{
                            upsert: true,
                            }
                            ).then(()=>console.log('Data Added!')).catch((error) => console.log(error))
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            return console.log('Error');
        }
    })
}


export default ParkingHistoryData;

