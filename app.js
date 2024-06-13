const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const { authentication } = require('@feathersjs/authentication');
const { jwt } = require('@feathersjs/authentication-jwt');
const { oauth } = require('@feathersjs/authentication-oauth');
const mongoose = require('mongoose');
const swagger = require('feathers-swagger');
require('dotenv').config();

const app = express(feathers());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

// Authentication
app.configure(authentication({ secret: process.env.JWT_SECRET }));
app.configure(jwt());
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
