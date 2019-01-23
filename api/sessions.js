const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('../knexfile');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const server = express();

const db = knex(knexConfig.development)

const sessionConfig = {
  name: 'authBanana', //default is sid
  secret: 'ldfksghjmgndf;lkghd;sazc,xvn;safjSVGForeignObjectElement.,NDFO;SZ',
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 min. in milliseconds
    secure: false, // only send cookie over https when true, during dev, set to false
  },
  httpOnly: true, // JS cant touch cookie
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    tablename: 'sessions',
    sidfieldname: 'sid',
    knex: db,
    createtable: true,
    clearInterval: 1000 * 60 * 10, // in milliseconds
  })
};


server.use(helmet());
server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(session(sessionConfig))

// SANITY CHECK
server.get('/', (req, res) => {
  res.send('👋🌎🌍🌏, api alive')
})

// REGISTER ROUTE
server.post('/register', (req, res) => {
  const userInfo = req.body;

  // hash password
  const hash = bcrypt.hashSync(userInfo.password, 12);

  userInfo.password = hash;

  db('users')
    .insert(userInfo)
    .then(ids => { 
      res.status(201)
      .json(ids)})
    .catch(err => res.status(500).json(err))
})

// LOGIN ROUTE
server.post('/login', (req, res) => {
  const credentials = req.body;
  
  db('users').where({username: credentials.username}).first().then(user => {
    if(user && bcrypt.compareSync(credentials.password, user.password)) {
      req.session.user = user
      res.status(200).json({message: `welcome ${user.name}`});
    } else {
      res.status(401).json({ message: "you shall not pass!!!!"})
    }
  })
  .catch(err => res.status(500).json(err))
})

function protected(req, res, next) {
  // if user is logged in call next()
  if(req.session.user) {
    next();
  } else {
    res.status(401).json({message: "you shall not pass! NOT AUTHORIZED"})
  }
}

// PROTECTED USERS ROUTE
server.get('/users', protected, async(req, res) => {
  const users = await db('users');
  res.status(200).json(users)
})

// LOGOUT ROUTE
server.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        res.status(500).send('you can never leave')
      } else {
        res.status(200).json({ message: "goodbye"})
      }
    });
  } else {
    res.json({ message: 'logged out already'})
  }
});

module.exports = server;