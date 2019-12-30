# It's Here IoTLock API

IoTLock can be connected to any DIY keypad enabled boxes such as a mailbox, delivery box or gun safe.

This is the backend API that powers the multi-user access and custom features for the IoTLock system.

## StreamIoT

The API integrates directly with StreamIoT and handles the authentication, authorization between the two systems, and allowing for multiple users to be connected to a single account.

### Integration Overview

When a new user registers with IoTLock an account is created first in the API and then in StreamIoT.  The API manages the security between the two platforms internally.

After the account is successfully created a user is created in the API that provides authentication and authorization for the API.  An IoTLock account can provide access to multiple users, users will have equal access to the account in the form of control.

Once a gateway is added to IoTLock with the API, the API creates a new device and channel for the device in StreamIoT.  StreamIoT is then queried by the API to find the relevant thing and channels ID for storage in its database.

The next step is when a mailbox is added to the API, the API creates a new channel in StreamIoT, and then the gateway device and mailbox channel are connected.  A mailbox must be connected to a gateway.

Remaining integration involves messages that get sent to direct the gateway and its mailbox(es) to perform actions like adding a PIN, unlocking, etc.

### Integration Messages

The following are specific messages that are used between the API and StreamIoT, these messages are sent over the built-in channels using automatically created devices by the API as discussed above.

* "CHANNEL-ID" - StreamIoT channel ID.
* "DEVICE-ID" - StreamIoT device ID.
* "PUBLIC-KEY" - Public key used in encryption.

__Connect gateway:__
[{"bn": "DEVICE-ID_", "n": "CONNECT", "u": "Requested", "vb": true}]

__Register gateway:__
[{"bn": "DEVICE-ID_", "n": "REGISTER", "u": "Requested", "vb": true}]

__Remove gateway:__
[{"bn": "CHANNEL-ID_", "n": "DESTRUCT", "u": "Gateway", "vs": "PUBLIC-KEY"}]

__Add mailbox to gateway:__
[{"bn": "DEVICE-ID_", "n": "ADD", "u": "PublicKey", "vs": "PUBLIC-KEY"}]

__Register mailbox:__
[{"bn": "CHANNEL-ID_", "n": "Mailbox", "u": "PublicKey", "vs": "PUBLIC-KEY"}]

__Add PIN to mailbox:__
[{"bn": "DEVICE-ID_", "n": "AUTH", "u": "PIN", "v": 1234}]

__Remove PIN from mailbox:__
[{"bn": "DEVICE-ID_", "n": "UNAUTH", "u": "PIN", "v": 1234}]

__Remove mailbox:__
[{"bn": "DEVICE-ID_", "n": "DELETE", "u": "PublicKey", "vs": "PUBLIC-KEY"}]
