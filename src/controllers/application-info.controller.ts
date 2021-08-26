import fs from 'fs';

import Logger from './logger.controller';

const logIndex = Logger.createChild({file: 'application-info.controller.ts'});

export default class ApplicationInfo {
    
    info?: any;
    appInfoFile = `${__dirname}/../secret/secret.json`;
    infoModified = false;

    constructor() {
        this.refreshAppInfo();
    }

    refreshAppInfo(): void {
        if (this.infoModified) {
            fs.writeFileSync(this.appInfoFile, JSON.stringify(this.info), 'utf-8');
            
            Logger.children[logIndex].debug(`Wrote data to: ${this.appInfoFile}`);
            this.infoModified = false;
        }
        let data = fs.readFileSync(this.appInfoFile, 'utf-8');
        Logger.children[logIndex].debug(`Read data from: ${this.appInfoFile}`)
        this.info = JSON.parse(data);
    }

    updateAccessToken(token: any, expiry: any, nonce: any): void {
        this.info.accessToken.token = token;
        this.info.accessToken.expires_in = expiry;
        this.info.accessToken.created_on = Date.now();
        this.info.accessToken.nonce = nonce;

        this.infoModified = true;
        this.refreshAppInfo();
    }

    checkAccessToken(): boolean {
        return this.info && 
            (!this.info.accessToken.token ||
            this.info.accessToken.token &&
            this.info.accessToken.created_on + this.info.accessToken.expires_in < Date.now());
    }
}