import got from 'got/dist/source';
import { Observable, Observer } from 'rxjs';
import ApplicationInfo from '../../controllers/application-info.controller';
import { paypalEnv } from '../../exports/config.exports';

const env = (process.env.NODE_ENV?.toLowerCase() == 'production') ? 'Live' : 'Sandbox';

export default class PaypalModule {

    createAuthToken(clientId: string, secret: string): Observable<Object> {
        return new Observable((obs: Observer<Object>) => {
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
                username: `${clientId}`,
                password: `${secret}`,
                resolveBodyOnly: true,
            }).then((response: any) => {
                obs.next(response);
            }).catch((error: any) => {
                obs.error(error);
            });
        })
    }

    createOrder(accessToken: string, countryCode: string, purchaseUnits: string): Observable<any> {
        console.log(accessToken, countryCode, purchaseUnits);
        return new Observable((obs: Observer<any>) => {
            got.post(`${paypalEnv.v2}/checkout/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                method: 'POST',
                responseType: 'json',
                json: {
                    "intent": "CAPTURE",
                    "purchase_units": [
                        {
                            "amount": {
                                "currency_code": countryCode,
                                "value": purchaseUnits
                            }
                        }
                    ]
                },
                resolveBodyOnly: true
            }).then((response) => {
                obs.next(response);
            }).catch((error: any) => {
                console.error(error);
                obs.error(error);
            });
        });
    }

    captureOrder(accessToken: string, orderId: string): Observable<any> {
        return new Observable((obs: Observer<any>) => {
            const url = `${paypalEnv.v2}/checkout/orders/${orderId}/capture`;
            console.log(url);
            got.post(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                method: 'POST',
                responseType: 'json',
                resolveBodyOnly: true
            }).then((response) => {
                obs.next(response);
            }).catch((error: any) => {
                console.error(error);
                obs.next(error);
            });
        });
    }
}