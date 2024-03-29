import express from 'express';
import { PathParams } from "express-serve-static-core";
import { RouterType } from "../../../exports/router.exports";
import ordersRoute from "./orders.route";
import tokensRoute from './tokens.route';

class PayPalRouter extends RouterType {

    constructor(path: PathParams) {
        super(path);
        
        ordersRoute.register(this.handle);
        tokensRoute.register(this.handle);
    }
}

const paypalRouter = new PayPalRouter('/paypal');
export default paypalRouter