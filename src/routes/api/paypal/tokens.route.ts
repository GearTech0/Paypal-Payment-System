import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import fs from 'fs';
import got from 'got/dist/source';
import { RouterType } from '../../../exports/router.exports';
import { paypalEnv } from '../../../exports/config.exports';
import * as secret from '../../../secret/secret.json';
import Logger from '../../../controllers/logger.controller';

const env = (process.env.NODE_ENV?.toLowerCase() == 'production') ? 'Live' : 'Sandbox';
const rootLogger = Logger.createChild({file: 'tokens.route.ts'});

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
            }).then((response: any) => {
                // Save access token
                if (response &&
                    (!secret['Access Token'].Token ||
                    secret['Access Token'].Token &&
                    secret['Access Token']['Created On'] + secret['Access Token']['Expires In'] < Date.now())
                ) {
                    secret['Access Token'].Token = response.access_token;
                    secret['Access Token']['Expires In'] = response.expires_in;
                    secret['Access Token']['Created On'] = Date.now();
                    secret['Access Token'].nonce = response.nonce;

                    fs.writeFile(`${__dirname}/../../../secret/secret.json`, JSON.stringify(secret), (err) => {
                        if (err) {
                            rootLogger.error(err);
                            res.status(400).json({err});
                            return;
                        }

                        rootLogger.info(`Access token has been created by requester`);
                        res.status(200).json({message: 'Access Token Saved', status: 'COMPLETE'});
                    });
                } else {
                    res.status(200).json({message: 'Access token already exists', status: 'COMPLETE'});
                }
            }).catch((reason: any) => {
                res.status(400).json({error: reason});
                rootLogger.error(reason);
            });
        });

        this.handle.post(`/identity/generate-token`, (req: Request, res: Response) => {
            got.post(`${paypalEnv.v1}/oauth2/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secret['Access Token'].Token}`,
                    'Accept-Language': 'en_US'
                },
                method: 'POST',
                responseType: 'json',
                resolveBodyOnly: true,
            }).then((response) => {
                res.status(200).json({response: response});
            }).catch((reason: any) => {
                res.status(400).json({error: reason});
                rootLogger.error(reason);
            });
        });
    }
}

const tokensRoute = new TokensRoute('/tokens');
export default tokensRoute;