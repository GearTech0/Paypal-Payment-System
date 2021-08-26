import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';
import fs from 'fs';
import got from 'got/dist/source';
import { RouterType } from '../../../exports/router.exports';
import { paypalEnv } from '../../../exports/config.exports';
import * as secret from '../../../secret/secret.json';
import Logger from '../../../controllers/logger.controller';

const env = (process.env.NODE_ENV?.toLowerCase() == 'production') ? 'Live' : 'Sandbox';
const logIndex = Logger.createChild({file: 'self.route.ts'});

class TokensRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        
        
    }
}

const selfRoute = new TokensRoute('/self');
export default selfRoute;