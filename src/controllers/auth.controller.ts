import bcrypt from 'bcrypt';
import { Observable, Observer } from 'rxjs';

export default class AuthController {
    static hashPassword(password: string): Observable<string> {
        return new Observable((obs: Observer<string>) => {
            bcrypt.genSalt().then((salt: string) => {
                bcrypt.hash(password, salt).then((hash: string) => {
                    obs.next(hash);
                }).catch((error: any) => {
                    obs.error(error);
                });
            }).catch((error: any) => {
                obs.error(error);
            });
        });
    }

    static checkPassword(password: string, current: string): Observable<boolean> {
        return new Observable((obs: Observer<boolean>) => {
            bcrypt.compare(password, current).then((pass: boolean) => {
                obs.next(pass);
            }).catch((error: any) => {
                obs.error(error);
            })
        });
    }
}