import express, { Router } from 'express';
import { RouterType } from '../exports/router.exports';
import { PathParams } from 'express-serve-static-core';
import paypalRouter from './api/paypal.router';

class BusRouter extends RouterType {
    
    constructor(path: PathParams) {
        super(path);

        paypalRouter.register(this.handle);
    }
}

const Bus = new BusRouter('/api');
export default Bus;