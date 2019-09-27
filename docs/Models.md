# SafeBox - Models

- All models will also contain `createdAt`, `deletedAt`, and `updatedAt` fields in addition to those listed below.

## Account

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

## Gateway

```json
{
  "accountId": 1,
  "deviceId": "UUIDv4",
  "deviceKey": "UUIDv4",
  "id": 1,
  "mailboxId": 1,
  "publicKey": "GD04...",
  "sn": "34252452534",
  "status": "AWAITING_SETUP"
}
```

- `deviceId` - The id of the device on StreamIOT.
- `publicKey` - The blockchain public key that is used for the starter kit account.
- `sn` - The gateway serial number that was scanned by the mobile app during mailbox setup.

## Mailbox

```json
{
  "accountId": 1,
  "gatewayId": 1,
  "id": 1,
  "name": "Custom Mailbox Name",
  "sn": "234234234234",
  "status": "AWAITING_SETUP"
}
```

- `sn` - The mailbox serial number that was scanned by the mobile app during mailbox setup.

## PINs

```json
{
  "accountId": 1,
  "email": "jane.doe@email.com",
  "id": 1,
  "mailboxId": 1,
  "number": 1234,
  "phone": "5555554321",
  "single": false,
  "timeout": 1569544673,
}
```

- `number` - The key pad number that will unlock the mailbox.
- `single` - If true then will be removed after it is used.
- `timeout` - If provided means that the PIN will expire at the provided seconds from unix epoch.

_Note: If `single` and `timeout` are provided then the PIN will be removed when it expires or is used, whichever comes first._

## User

```json
{
  "accountId": 1,
  "email": "john.doe@email.com",
  "google": true,
  "id": 1,
  "name": "John Doe",
  "phone": "5555551234",
  "pushToken": "PUSH_NOTIFICATION_TOKEN",
  "token": "SOME_TOKEN_HERE"
}
```

- `google` - Was Google OAuth 2 used for this account.
- `pushToken` - The push notification token for the user.
- `token` - Will be handled according to the authentication method.
