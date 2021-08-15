export const cfg = {
    PaypalURL: {
        live: {
            v1: 'https://api-m.paypal.com/v1',
            v2: 'https://api-m.paypal.com/v2'
        },
        dev: {
            v1: 'https://api-m.sandbox.paypal.com/v1',
            v2: 'https://api-m.sandbox.paypal.com/v2'
        }
    }
}

export const paypalEnv = (process.env.NODE_ENV == 'production') ? cfg.PaypalURL.live : cfg.PaypalURL.dev;