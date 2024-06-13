const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const { authentication } = require('@feathersjs/authentication');
const { jwt } = require('@feathersjs/authentication-jwt');
const { local } = require('@feathersjs/authentication-local');
const { oauth } = require('@feathersjs/authentication-oauth');
const mongoose = require('mongoose');
const swagger = require('feathers-swagger');
const postmark = require('postmark');
require('dotenv').config();

const app = express(feathers());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

// Authentication
app.configure(authentication({ secret: process.env.JWT_SECRET }));
app.configure(jwt());
app.configure(local());
app.configure(oauth({
  name: 'google',
  Strategy: require('passport-google-oauth20').Strategy,
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  successRedirect: '/',
}));

// Swagger Configuration
app.configure(swagger({
  docsPath: '/swagger',
  uiIndex: true,
  specs: {
    info: {
      title: 'Koi Core API',
      description: 'API documentation for Koi Core API',
      version: '1.0.0'
    }
  }
}));

// Services
require('./services/user.service')(app);
require('./services/koi.service')(app);

// Verification route
app.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  try {
    const user = await app.service('users').verifyEmail(token);
    res.status(200).send(`Email verified for ${user.email}. Please set your password.`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Set password route
app.post('/set-password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await app.service('users').setPassword(email, password);
    res.status(200).send(`Password set for ${user.email}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Error handling
app.use(express.errorHandler());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3030).on('listening', () => {
  console.log('Feathers server listening on http://localhost:3030');
});
