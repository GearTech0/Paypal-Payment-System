import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import got, {Response as GotResponse} from 'got';
import Logger from '../../../controllers/logger.controller';
import { paypalEnv } from '../../../exports/config.exports';
import { RouterType } from '../../../exports/router.exports';
import * as secret from '../../../secret/secret.json';

const rootLogger = Logger.createChild({file: 'index.ts'});

class OrdersRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);

        this.handle.get('/ping', (req: Request, res: Response) => {
            res.status(200).json({response: 'pong'});
            rootLogger.debug(secret);
        });

        this.handle.post('/', (req: Request, res: Response) => {
            got.post(`${paypalEnv.v2}/checkout/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secret['Access Token'].Token}`
                },
                method: 'POST',
                responseType: 'json',
                json: {
                    "intent": "CAPTURE",
                    "purchase_units": [
                        {
                            "amount": {
                                "currency_code": req.body.countryCode || "USD",
                                "value": req.body.purchaseUnits
                            }
                        }
                    ]
                },
                resolveBodyOnly: true
            }).then((response) => {
                rootLogger.debug(req.body);
                rootLogger.debug(response);
                res.status(200).json({response});
            }).catch((reason: any) => {
                rootLogger.error(reason);
                res.status(400).json({status: 'ERROR', error: reason});
            });
        });

        this.handle.post('/authorize', (req: Request, res: Response) => {
            const url = `${paypalEnv.v2}/checkout/orders/${req.body.orderId}/capture`;
            console.log(url);
            got.post(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secret['Access Token'].Token}`,
                },
                method: 'POST',
                responseType: 'json',
                resolveBodyOnly: true
            }).then((response) => {
                rootLogger.debug(response);
                res.status(200).json({response});
            }).catch((reason: any) => {
                rootLogger.error(reason);
                res.status(400).json({error: reason});
            });
        });
    }
}

const ordersRoute = new OrdersRoute('/orders');
export default ordersRoute