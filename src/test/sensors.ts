process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import * as server from '../index';

import {parkingHistorySensors, parkingSensors} from "../schema/parksensorSchema";


describe('Our Parking Sensors', function (){
    beforeEach((done)=>{
    chai.use(require('chai-http'));
        parkingHistorySensors.deleteMany({},(_err)=>{
            parkingSensors.deleteMany({},(_err)=>{
                done();
            })
        })
    })

    describe('/GET parking empty', () =>{
        it('it should GET Empty Data',async()=>{
            return chai.request(server).get('/').then((res)=>{

                chai.expect(res).to.have.status(200);
            });
        })
    })
});