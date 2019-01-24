require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const knex = require("knex");
const knexConfig = require("../knexfile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const server = express();

const db = knex(knexConfig.development);

server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

// SANITY CHECK
server.get("/", (req, res) => {
  res.send("👋🌎🌍🌏, api alive");
});

// REGISTER ROUTE
server.post("/register", (req, res) => {
  const userInfo = req.body;

  // hash password
  const hash = bcrypt.hashSync(userInfo.password, 12);

  userInfo.password = hash;

  db("users")
    .insert(userInfo)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.status(500).json(err));
});

// FUNCTION TO GENERATE TOKEN
function generateToken(user) {
  const payload = {
    username: user.username,
    name: user.name,
    roles: ["admin", "sales"]
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "10m"
  };

  return jwt.sign(payload, secret, options);
}

// LOGIN ROUTE
server.post("/login", (req, res) => {
  const credentials = req.body;

  db("users")
    .where({ username: credentials.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        // login is successful
        // create token
        const token = generateToken(req.body);
        res.status(200).json({ message: `welcome ${user.name}`, token });
      } else {
        res.status(401).json({ message: "you shall not pass!!!!" });
      }
    })
    .catch(err => res.status(500).json(err));
});

function protected(req, res, next) {
  // if user is logged in call next()
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "invalid token" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}

function checkRole(roll) {
  return function(req, res, next) {
    if (req.decodedToken.roles.includes(roll)) {
      next();
    } else {
      res.status(403).json({ message: `not authorized, ${roll} only` });
    }
  };
}

// PROTECTED USERS ROUTE  protected, checkRole("accountant"),
server.get("/users", async (req, res) => {
  const users = await db("users").select("id", "username", "name");
  res.status(200).json({ users, decodedToken: req.decodedToken });
});

// GET ME ROUTE
server.get("/users/me", protected, checkRole("admin"), async (req, res) => {
  const user = await db("users")
    .where({ username: req.decodedToken.username })
    .first();

  res.status(200).json(user);
});

// GET SINGLE USER
server.get("/users/:id", protected, async (req, res) => {
  const user = await db("users")
    .where({ id: req.params.id })
    .first();

  res.status(200).json(user);
});

module.exports = server;
