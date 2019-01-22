## dependencies

- express
- helmet
- nodemon -dev
- knex
- sqlite3
- bcryptjs
- express-session
- connect-session-knex

## workflow

- user logs in
- server creates a session and provides a cookie with session info
- subsequent requests the client sends the cookie
- server checks cookie and provides/denies access 
