import fs from 'fs';
import Logger from './logger.controller';

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
            
            console.log(`Wrote data to: ${this.appInfoFile}`);
            this.infoModified = false;
        }
        let data = fs.readFileSync(this.appInfoFile, 'utf-8');
        console.log(`Read data from: ${this.appInfoFile}`)
        this.info = JSON.parse(data);
    }

    updateAccessToken(token: any, expiry: any, nonce: any): void {
        this.info['Access Token'].Token = token;
        this.info['Access Token']['Expires In'] = expiry;
        this.info['Access Token']['Created On'] = Date.now();
        this.info['Access Token'].nonce = nonce;

        this.infoModified = true;
        this.refreshAppInfo();
    }

    checkAccessToken(): boolean {
        return this.info && 
            (!this.info['Access Token'].Token ||
            this.info['Access Token'].Token &&
            this.info['Access Token']['Created On'] + this.info['Access Token']['Expires In'] < Date.now());
    }
}