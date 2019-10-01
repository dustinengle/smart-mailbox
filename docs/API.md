# SafeBox - API

## Public

The following routes are open to the public.

* `GET /` - Delivers the landing page that provides information about the platform and links to the apps.
* `POST /activate` - Allow the gateway device to easily register itself against the account providing its identification information.
* `POST /login` - Login to an account with Google OAuth2 or email and password combination.
* `POST /oauth` - Handle Google OAuth 2 redirect.
* `POST /register` - Create a new account using Google OAuth2 or email and password combination.
  - Setup an account on StreamIOT.

## Private

Requires authentication token to access these endpoints.

__Account__

* `GET /account/balance` - Get the StreamIOT blockchain account balance.
* `GET /account/messages` - Get the current list of messages from StreamIOT for the channel on the account.
* `GET /account` - Get the account for the logged in user.

__Gateway__

* `GET /gateway/balance` - Get the balance of the gateway starter kit blockchain account balance.
* `DELETE /gateway` - Remove the gateway from account.
  - Remove mailbox associations and starter kit funds should return to main account on StreamIOT.
* `GET /gateway` - Returns the list of gateways on the account.
* `POST /gateway` - Manually register a gateway to an account.
* `PUT /gateway` - Update a registered gateway on an account.

__Mailbox__

* `POST /mailbox/lock` - Send a lock command to the mailbox.
* `DELETE /mailbox/pin` - Remove a pin from the mailbox.
* `POST /mailbox/pin` - Send a new pin number to the mailbox to provide access.
* `POST /mailbox/status` - Request a status update from the mailbox.
* `POST /mailbox/unlock` - Send an unlock command to the mailbox.
* `DELETE /mailbox` - Remove a mailbox from the account.
  - Funds for the starter kit account should be moved back into the main account.
  - Mailbox history will be kept but hidden from general queries.
* `GET /mailbox` - Return the list of mailboxes for the account.
* `POST /mailbox` - Register a mailbox with the logged in account.
  - This should start the connect and register flow in the starter kit and StreamIOT.  The gateway should make sure that this is accomplished on its own.
  - The identification information for the gateway and mailbox should be included in order to allow for easy activation with an activation code that will be provided on success.
  - Setup a matching channel on StreamIOT.
* `PUT /mailbox` - Update a mailbox on the account.  Pretty
much just change its type and name.

__User__

* `DELETE /user` - Remove a user from the account.
* `GET /user` - Return the list of users for an account.
* `POST /user` - Add a new user to the account.
  - If the user has login access to the account a link will be emailed or sent in SMS to the user to download the app and provide the invite code.
  - If the user has PIN access then the code will be emailed or sent in SMS to the user directly from the phone.
* `PUT /user` - Update a user's information.
  - If their access level changes to allow mobile login then send either the email or SMS.
