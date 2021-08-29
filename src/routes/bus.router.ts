import express, { Router } from 'express';
import { RouterType } from '../exports/router.exports';
import { PathParams } from 'express-serve-static-core';
import paypalRouter from './api/paypal/paypal.router';
import accountRoute from './api/accounts/accounts.route';

class BusRouter extends RouterType {
    
    constructor(path: PathParams) {
        super(path);

        paypalRouter.register(this.handle);
        accountRoute.register(this.handle);
    }
}

const Bus = new BusRouter('/api');
export default Bus;