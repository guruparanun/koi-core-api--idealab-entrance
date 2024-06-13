const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const { authentication } = require('@feathersjs/authentication');
const { jwt } = require('@feathersjs/authentication-jwt');
const { oauth } = require('@feathersjs/authentication-oauth');
const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const KOLModel = require('./models/kol.model');
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

// Services
app.use('/kol', service({ Model: KOLModel }));

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
