dependencies

- express
- helmet
- nodemon --dev
- knex and sqlite3

- add bcryptjs

client > orders (decide cascade strategy)

.onUpdate('CASCADE')
.onDelete('RESTRICT')

workflow
- use logs in
- server creates a session and provides a cookie with session info
- subsequent requests the client sends the cookie
- server checks the cookie find the session and provides/denies access

OAuth2: authorization framework.
Open ID Connect: authentication protocol.

Tokens:
- authentication/id token. Who are you?
- access/authorization token. What can you do?
- refresh token.

Working with JWTs

Server's responsibility
- producing the token
- sending the token to the client

- reading the token from the request

- verifying the token is valid

- providing data (payload) from the token to the rest of the application

Client's Responsibility
- store the token and hold on to it
- send the token on every request
- on logout, destroy the token

Routes
- /login
- /users ... requires authentication, should send the jwt
- /register

users *---* roles 
roles *---* permissions
users *---* permissions

in OAuth2, permissions are called scopes ('read:salary', 'edit:salary')