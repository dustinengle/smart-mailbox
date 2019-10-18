# It's Here - LoRa Protocol

## Features

* Every packet will be cryptography signed with a per packet incrementing nonce setup at random.
* General flow is request and reply with acknowledgement packets.
* Devices will automatically configure themselves and setup a unique network configuration.

## Security

* The secret key will consist of the unique identifier of the device with a nonce that will be hashed using SHA256.
* Will use AES-128 encryption that will produce an output of 16 bytes that will be used as a signature for packets.

## `OP` Codes

Operation codes used to define packet size and features.

* `0x00` - `ACK`
* `0x01` - `AUTH`
* `0x02` - `CONNECT`
* `0x03` - `LOCK`
* `0x04` - `PIN`
* `0x05` - `STATUS`
* `0x06` - `UNAUTH`
* `0x07` - `UNLOCK`

## `ERR` Codes

* `0x00` - `NONE`
* `0x01` - `FILE_READ`
* `0x02` - `FILE_WRITE`
* `0x03` - `FLAG_READ`
* `0x04` - `LORA_READ`
* `0x05` - `LORA_SIG`
* `0x06` - `LORA_WRITE`
* `0x07` - `LOCK_READ`
* `0x08` - `LOCK_WRITE`
* `0x09` - `PIN_READ`
* `0x0a` - `PIN_WRITE`
* `0x0b` - `PROX_READ`
* `0x0c` - `PWR_READ`

## Packet Types

* `ACK` - acknowledge the received packet.
  - If the mailbox it will include the state information.
  - In response to a `CONNECT` packet the `SIG` field will contain the nonce for further usage in `SIG` verification.
* `AUTH` - add a new PIN to the mailbox.
* `CONNECT` - connect the gateway and mailbox together on a random network.
  - ACK packet will be sent on new network configuration but `SIG` field will contain the nonce for further communication between the gateway and mailbox.
* `LOCK` - put the mailbox in the locked state.
* `PIN` - notify gateway of pin usage.
* `STATUS` - request a status update from the mailbox.
  - Status update will bein ACK packet.
* `UNAUTH` - remove a PIN from the mailbox.
* `UNLOCK` - unlock the mailbox.

## Packet Structures

__ACK:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 1 | `ERR` | The error code for the request operation. |
| 1 | `FLAG` | If true the flag is up, false down. |
| 1 | `LOCK` | If true the lock is locked, false unlocked. |
| 1 | `PACK` | If true there is a package, false waiting. |
| 1 | `PWR` | The battery power percentage (1-100). |
| 16 | `SIG` | The packet signature. |

__AUTH:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 4 | `PIN` | The pin code that will unlock the mailbox. |
| 16 | `SIG` | The packet signature. |

__CONNECT:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 1 | `SYNC` | The new sync word for the LoRa network configuration. |
| 6 | `SN` | The serial number of the gateway (MAC Address). |

__LOCK:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 16 | `SIG` | The packet signature. |

__PIN:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 4 | `PIN` | The pin used by a user. |
| 1 | `AUTH` | If true the pin worked, false it was denied. |
| 16 | `SIG` | The packet signature. |

__STATUS:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 16 | `SIG` | The packet signature. |

__UNAUTH:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 4 | `PIN` | The pin code that will be removed from the mailbox. |
| 16 | `SIG` | The packet signature. |

__UNLOCK:__

| Byte(s) | Value | Description or Notes |
|---|---|---|
| 1 | `OP` | The packet operation code. |
| 16 | `SIG` | The packet signature. |
