## Basic PayPal Payment Server

API:

# GET 
## /api/paypal/tokens/access
## Body 
- ```no body is needed```

Currently, looks to the secret file 'src/secret/secret.json' for your paypal
secret and ClientID. In a production environment, the values for `secret.Live.Secret` and `secret.Live['Client ID']` will be used. The dev environment will use `secret.Sandbox` instead.

# POST
## /api/paypal/orders
## Body
- accessToken: the access token created by the `/tokens/access` route

- purchaseUnits: The amount to charge for product

- (optional): countryCode: default 'US'. See paypal country codes documentation.

Creates an order and returns a fullfillment link to finalize the purchase.

## /api/paypal/orders/authorize
## Body
- accessToken: The access token recieved from the `/tokens/access` route.

- orderId: The ID value recieved from the `/paypal/orders` route.

Captures the purchase, thus confirming the transaction, where you receive a receipt of said purchase as a response.