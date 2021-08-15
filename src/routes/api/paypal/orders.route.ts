import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import got, {Response as GotResponse} from 'got';
import { paypalEnv } from '../../../exports/config.exports';
import { RouterType } from '../../../exports/router.exports';

class OrdersRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);

        this.handle.get('/ping', (req: Request, res: Response) => {
            res.status(200).json({response: 'pong'});
        });

        this.handle.post('/', (req: Request, res: Response) => {
            got.post(`${paypalEnv.v2}/checkout/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body.accessToken}`
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
                console.log(req.body);
                console.log(response);
                res.status(200).json({response});
            }).catch((reason: any) => {
                console.error(reason);
                res.status(400).json({status: 'ERROR', error: reason});
            });
        });

        this.handle.post('/authorize', (req: Request, res: Response) => {
            const url = `${paypalEnv.v2}/checkout/orders/${req.body.orderId}/capture`;
            console.log(url);
            got.post(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body.accessToken}`,
                },
                method: 'POST',
                responseType: 'json',
                resolveBodyOnly: true
            }).then((response) => {
                console.log(response);
                res.status(200).json({response});
            }).catch((reason: any) => {
                console.error(reason);
                res.status(400).json({error: reason});
            });
        });
    }
}

const ordersRoute = new OrdersRoute('/orders');
export default ordersRoute