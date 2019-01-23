## dependencies for sessions

- express
- helmet
- nodemon -dev
- knex
- sqlite3
- bcryptjs
- express-session
- connect-session-knex
  - FOR JWTs
    - jsonwebtoken


## workflow

- user logs in
- server creates a session and provides a cookie with session info
- subsequent requests the client sends the cookie
- server checks cookie and provides/denies access 

## OAuth2: authorization framework
  Open ID Connect: authentication protocol.

## Tokens:
  - authentication/id token. Who are you?
  - access/authorization token. What can you do?
  - refresh token.

  ## Working with JWTs

  -Server's Responsibility
    - producing the token
    - sending the token to the client
    - reading the token from the request
    - verifying the token is valid
    - providing data (payload) from the token to the rest of the application
  - Client's Responsibility
    - store the toke and hold onto it
    - sent the token on every request
    -on logout, destroy the token