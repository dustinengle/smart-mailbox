# SafeBox - API

## Models

- All models will also contain `createdAt`, `deletedAt`, and `updatedAt` fields in addition to those listed below.

### Account

```json
{
  "channelId": "UUIDv4",
  "id": 1,
  "email": "john.doe@email.com",
  "password": "password!1",
  "publicKey": "GD03...",
  "token": "JWT"
}
```

- `channelId` - The channel id for usage with StreamIOT.
- `email` - The StreamIOT account email address.
- `password` - The StreamIOT account password.
- `publicKey` - The blockchain public key that is used for the StreamIOT account.
- `token` - The account login token to use while active.

### Gateway

```json
{
  "accountId": 1,
  "deviceId": "UUIDv4",
  "id": 1,
  "mailboxId": 1,
  "publicKey": "GD03...",
  "sn": 34252452534,
  "status": "AWAITING_SETUP"
}
```

- `deviceId` - The id of the device on StreamIOT.
- `publicKey` - The blockchain public key that is used for the starter kit account.
- `sn` - The gateway serial number that was scanned by the mobile app during mailbox setup.

### Mailbox

```json
{
  "accountId": 1,
  "gatewayId": 1,
  "id": 1,
  "name": "Custom Mailbox Name",
  "sn": 34252452534,
  "status": "AWAITING_SETUP"
}
```

- `sn` - The mailbox serial number that was scanned by the mobile app during mailbox setup.

### PINs

```json
{
  "accountId": 1,
  "id": 1,
  "mailboxId": 1,
  "number": 1234,
  "single": false,
  "timeout": 1569544673,
  "userId": 1
}
```

- `number` - The key pad number that will unlock the mailbox.
- `single` - If true then will be removed after it is used.
- `timeout` - If provided means that the PIN will expire at the provided seconds from unix epoch.

_Note: If `single` and `timeout` are provided then the PIN will be removed when it expires or is used, whichever comes first._

### User

```json
{
  "accountId": 1,
  "email": "john.doe@email.com",
  "google": true,
  "id": 1,
  "mobile": true,
  "name": "John Doe",
  "phone": 5555551234,
  "pushToken": "PUSH_NOTIFICATION_TOKEN",
  "sms": true,
  "token": "SOME_TOKEN_HERE"
}
```

- `google` - Was Google OAuth 2 used for this account.
- `mobile` - Defines if the user can login with the mobile app or only has PIN access.
- `pushToken` - The push notification token for the user.
- `sms` - If true then the mobile app will send a SMS using the phone's carrier, if false an email will be sent from the mobile phone.
- `token` - Will be handled according to the authentication method.

## Endpoints

### Public

The following routes are open to the public.

* `GET /` - Delivers the landing page that provides information about the platform and links to the apps.
* `POST /activate` - Allow the gateway device to easily register itself against the account providing its identification information.
* `POST /login` - Login to an account with Google OAuth2 or email and password combination.
* `POST /oauth` - Handle Google OAuth 2 redirect.
* `POST /register` - Create a new account using Google OAuth2 or email and password combination.
  - Setup an account on StreamIOT.
  - Setup a `safebox` channel on StreamIOT.

### Private

Requires authentication token to access these endpoints.

__Account__

* `GET /account/balance` - Get the StreamIOT blockchain account balance.
* `GET /account/messages` - Get the current list of messages from StreamIOT for the channel on the account.

__Gateway__

* `GET /gateway/balance` - Get the balance of the gateway starter kit blockchain account balance.
* `DELETE /gateway` - Remove the gateway from account.
  - Remove mailbox associations and starter kit funds should return to main account on StreamIOT.
* `POST /gateway` - Manually register a gateway to an account.
* `PUT /gateway` - Update a registered gateway on an account.

__Mailbox__

* `POST /mailbox/lock` - Send a lock command to the mailbox.
* `POST /mailbox/status` - Request a status update from the mailbox.
* `POST /mailbox/unlock` - Send an unlock command to the mailbox.
* `DELETE /mailbox` - Remove a mailbox from the account.
  - Funds for the starter kit account should be moved back into the main account.
  - Mailbox history will be kept but hidden from general queries.
* `POST /mailbox` - Register a mailbox with the logged in account.
  - This should start the connect and register flow in the starter kit and StreamIOT.  The gateway should make sure that this is accomplished on its own.
  - The identification information for the gateway and mailbox should be included in order to allow for easy activation with an activation code that will be provided on success.
* `PUT /mailbox` - Update a mailbox on the account.  Pretty
much just change its type and name.

__User__

* `DELETE /user` - Remove a user from the account.
* `POST /user` - Add a new user to the account.
  - If the user has login access to the account a link will be emailed or sent in SMS to the user to download the app and provide the invite code.
  - If the user has PIN access then the code will be emailed or sent in SMS to the user directly from the phone.
* `PUT /user` - Update a user's information.
  - If their access level changes to allow mobile login then send either the email or SMS.
