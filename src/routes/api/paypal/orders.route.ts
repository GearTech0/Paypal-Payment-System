import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import got, {Response as GotResponse} from 'got';
import ApplicationInfo from '../../../controllers/application-info.controller';
import Logger from '../../../controllers/logger.controller';
import { ENV, paypalEnv } from '../../../exports/config.exports';
import { RouterType } from '../../../exports/router.exports';
import PaypalModule from '../../../modules/paypal/paypal.module';
import * as secret from '../../../secret/secret.json';

const rootLogger = Logger.createChild({file: 'orders.route.ts'});

class OrdersRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        
        let app = new ApplicationInfo();
        let paypal = new PaypalModule();

        this.handle.get('/ping', (req: Request, res: Response) => {
            res.status(200).json({response: 'pong'});
            rootLogger.debug(secret);
        });

        this.handle.post('/', (req: Request, res: Response) => {
            app.refreshAppInfo();
            paypal
                .createOrder(
                    app.info.accessToken.token, 
                    req.body.countryCode || 'USD', 
                    req.body.purchaseUnits,
                    app.info.accounts.Sandbox["0004"].email)
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
                        res.status(400).json({status: 'ERROR', error});
                    }
                })
        });
    }
}

const ordersRoute = new OrdersRoute('/orders');
export default ordersRoute