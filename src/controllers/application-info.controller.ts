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

    createUser(
        email: string, 
        firstName: string, 
        lastName: string, 
        passwordHash: string, 
        ENV: string
    ): string {
        // check account exists
        if (this.info.accounts[ENV][email]) {
            return 'EXISTS';
        }
        
        // create new account
        this.info.accounts[ENV][email] = {};
        this.info.accounts[ENV][email].email = email;
        this.info.accounts[ENV][email].password = passwordHash;
        this.info.accounts[ENV][email].firstName = firstName;
        this.info.accounts[ENV][email].lastName = lastName;
        
        this.infoModified = true;
        this.refreshAppInfo();
        return 'CREATED';
    }

    getUser(email: string, ENV: string) {
        return this.info.accounts[ENV][email] || undefined;
    }

    refreshAppInfo(): void {
        if (this.infoModified) {
            fs.writeFileSync(this.appInfoFile, JSON.stringify(this.info), 'utf-8');
            
            Logger.children[logIndex].debug(`Wrote data to: ${this.appInfoFile}`);
            this.infoModified = false;
        }
        let data = fs.readFileSync(this.appInfoFile, 'utf-8');
        Logger.children[logIndex].debug(`Read data from: ${this.appInfoFile}`);
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