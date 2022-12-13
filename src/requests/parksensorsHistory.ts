import * as cron from 'node-cron';
import { parkingHistory } from '../schema/parkingHistorySchema';
import { parkingSensors } from '../schema/parksensorSchema';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const parkingHistoryData = () => {
    cron.schedule('0 0 * * *', async () => {
        const today = new Date();
        const onlyDate = today.toISOString().split('T')[0];
        const result = await parkingSensors.find();
        if (result) {
            for (const resultElement of result) {
                const id = resultElement.body.device_id;
                const config = {
                    method: 'get',
                    url: `https://mainova.element-iot.com/api/v1/devices/${id}/readings?limit=10&measured_at=${onlyDate}&auth=${process.env.API_KEY}`,
                };

                axios(config)
                    .then(async function (result) {
                        await parkingHistory
                            .findOneAndUpdate(
                                { 'body.device_id': result.data.body[0].device_id },
                                {
                                    $set: {
                                        device_id: result.data.body[0].device_id,
                                        body: { date: today, dailyData: result.data.body },
                                    },
                                },
                                {
                                    upsert: true,
                                }
                            )
                            .then(() => console.log(`Data of Device:${result.data.body[0].device_id} Added!`))
                            .catch((error) => console.log(error));
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            return console.log('No Data found');
        }
    });
};

export default parkingHistoryData;
