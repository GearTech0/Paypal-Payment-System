import { Request, Response } from 'express';
import { PathParams } from 'express-serve-static-core';

import { RouterType } from '../../../exports/router.exports';
import Logger from '../../../controllers/logger.controller';
import ApplicationInfo from '../../../controllers/application-info.controller';
import AuthController from '../../../controllers/auth.controller';
import { ENV } from '../../../exports/config.exports';

const logIndex = Logger.createChild({file: 'accounts.route.ts'});

class TokensRoute extends RouterType {
    constructor(path: PathParams) {
        super(path);
        
        let app = new ApplicationInfo();

        this.handle.post('/signup', (req: Request, res: Response) => {
            if (
                req.body.email && 
                req.body.password &&
                req.body.firstName && 
                req.body.lastName
            ) {
                AuthController
                .hashPassword(req.body.password)
                .subscribe({
                    next: (hash: string) => {
                        app.refreshAppInfo();
                        const status = app.createUser(
                            req.body.email, 
                            req.body.firstName, 
                            req.body.lastName, 
                            hash, ENV
                            );
                        res.status(200).json({status, message: `Responded with status ${status}`});
                    },
                    error: (error: string) => {
                        Logger.children[logIndex].warn(`Error found during hashing: ${error}`);
                        res.status(400).json({error});
                    }
                })
            } else {
                res.status(400).json({message: 'Invalid entry'});
            }
        });

        this.handle.post('/login', (req: Request, res: Response) => {
            if (req.body.email && req.body.password) {
                const user = app.getUser(req.body.email, ENV);
                if (user) {
                    AuthController.checkPassword(req.body.password, user.password)
                        .subscribe({
                            next: (authenticated: boolean) => {
                                if (authenticated) {
                                    res.status(200).json({token: {}, status: 'AUTHENTICATED'});
                                } else {
                                    res.status(400).json({status: 'AUTHENTICATION_ERROR'});
                                }
                            }
                        })
                } else {
                    res.status(400).json({status: 'AUTHENTICATION_ERROR', message: 'Possible reason is the user might not exist'});
                }
            } else {
                res.status(400).json({message: 'Invalid entry'});
            }
        });
    }
}

const accountRoute = new TokensRoute('/accounts');
export default accountRoute;