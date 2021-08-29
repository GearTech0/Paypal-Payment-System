import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';

import ApplicationInfo from '../../../controllers/application-info.controller';
import Logger from '../../../controllers/logger.controller';
import { ENV } from '../../../exports/config.exports';
import { RouterType } from '../../../exports/router.exports';
import PaypalModule from '../../../modules/paypal/paypal.module';

const logIndex = Logger.createChild({file: 'orders.route.ts'});

class OrdersRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        
        let app = new ApplicationInfo();
        let paypal = new PaypalModule();

        this.handle.get('/ping', (req: Request, res: Response) => {
            res.status(200).json({response: 'pong'});
            Logger.children[logIndex].debug(app.info);
        });

        this.handle.post('/', (req: Request, res: Response) => {
            app.refreshAppInfo();
            paypal
                .createOrder(
                    app.info.accessToken.token, 
                    req.body.countryCode || 'USD', 
                    req.body.purchaseUnits,
                    app.info.accounts[ENV]["0004"].email)   // TODO: update key with a fetch of the user auth in req body
                .subscribe({
                    next: (response: any) => {
                        res.status(200).json({
                            id: response.id, 
                            status: response.status, 
                            link: response.links[1]
                        });
                    },
                    error: (error: any) => {
                        res.status(400).json({status: 'ERROR', error});
                    }
                })
        });

        this.handle.post('/capture', (req: Request, res: Response) => {
            app.refreshAppInfo();
            paypal
                .captureOrder(app.info.accessToken.token, req.body.orderId)
                .subscribe({
                    next: (response: any) => {
                        res.status(200).json({response});
                    },
                    error: (error: any) => {
                        Logger.children[logIndex].debug(`Error was discovered: ${error}`);
                        res.status(400).json({status: 'ERROR', error});
                    }
                })
        });
    }
}

const ordersRoute = new OrdersRoute('/orders');
export default ordersRoute