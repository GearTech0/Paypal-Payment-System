import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import fs from 'fs';
import got from 'got/dist/source';
import { RouterType } from '../../../exports/router.exports';
import { paypalEnv } from '../../../exports/config.exports';
//import * as secret from '../../../secret/secret.json';
import Logger from '../../../controllers/logger.controller';
import ApplicationInfo from '../../../controllers/application-info.controller';
import PaypalModule from '../../../modules/paypal/paypal.module';

const env = (process.env.NODE_ENV?.toLowerCase() == 'production') ? 'Live' : 'Sandbox';
const rootLogger = Logger.createChild({file: 'tokens.route.ts'});

class TokensRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        let app = new ApplicationInfo();
        
        this.handle.get('/access', (req: Request, res: Response) => {
            let paypal = new PaypalModule();
            if (app.checkAccessToken()) {
                paypal
                    .createAuthToken(app.info[env].client_id, app.info[env].secret)
                    .subscribe({
                        next: (response: any) => {
                            app.updateAccessToken(
                                response.access_token,
                                response.expires_in,
                                response.nonce
                            );
                            console.log('new access token: ', app.info.accessToken);
                            res.status(200).json({message: 'Access Token Saved', status: 'COMPLETE'});
                        },
                        error: (error: any) => {
                            res.status(400).json({error})
                        }
                    })
            } else {
                res.status(200).json({message: 'Access Already Exists!', status: 'COMPLETE'})
            }
        });
    }
}

const tokensRoute = new TokensRoute('/tokens');
export default tokensRoute;