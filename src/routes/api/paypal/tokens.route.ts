import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import got from 'got/dist/source';
import { RouterType } from '../../../exports/router.exports';
import { paypalEnv } from '../../../exports/config.exports';
import * as secret from '../../../secret/secret.json';

const env = (process.env.NODE_ENV?.toLowerCase() == 'production') ? 'Live' : 'Sandbox';

class TokensRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        
        this.handle.get('/access', (req: Request, res: Response) => {
            got.post(`${paypalEnv.v1}/oauth2/token`, {
                headers: {
                    'Accept-Language': 'en_US',
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                responseType: 'json',
                form: {
                    'grant_type': 'client_credentials'
                },
                username: `${secret[env]['Client ID']}`,
                password: `${secret[env].Secret}`,
                resolveBodyOnly: true,
            }).then((response) => {
                res.status(200).json({response: response});
            }).catch((reason: any) => {
                res.status(400).json({error: reason});
                console.error(reason);
            });
        });

        this.handle.post(`/identity/generate-token`, (req: Request, res: Response) => {
            got.post(`${paypalEnv.v1}/oauth2/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${req.body.accessToken}`,
                    'Accept-Language': 'en_US'
                },
                method: 'POST',
                responseType: 'json',
                resolveBodyOnly: true,
            }).then((response) => {
                res.status(200).json({response: response});
            }).catch((reason: any) => {
                res.status(400).json({error: reason});
                console.error(reason);
            });
        });
    }
}

const tokensRoute = new TokensRoute('/tokens');
export default tokensRoute;