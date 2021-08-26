import express, { json, urlencoded } from 'express';
import cors from 'cors';

import Logger from './logger.controller';
import Bus from '../routes/bus.router';

const logIndex = Logger.createChild({file: 'express.controller.ts'});

export default class ExpressController {

    private app = express();
    private port = 3000;

    constructor() {
    }

    public start(): void {
        this.setup();
        this.startServer();
    }

    private setup(): void {
        this.app.use(urlencoded({extended: true}));
        this.app.use(json());
        this.app.use(cors({origin: '*'}));
        this.app.use('/api', Bus.getHandle());
    }

    private startServer(): void {
        this.app.listen(this.port, () => {
            Logger.children[logIndex].info(`Application is listening on port: ${this.port}`);
        });
    }
}