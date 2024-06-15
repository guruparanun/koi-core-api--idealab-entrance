const { expect } = require('chai');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('\'users\' service', () => {
  before(async () => {
    await mongoose.connect(app.get('mongodb'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('registered the service', () => {
    const service = app.service('users');
    expect(service).to.not.be.undefined;
  });

  it('creates a user with email and sends verification email', async () => {
    const email = `test${Date.now()}@example.com`;
    const user = await app.service('users').create({ email });

    expect(user).to.include({ email });
    expect(user.name).to.equal(email);
    expect(user.isVerified).to.be.false;
    expect(user.verificationToken).to.not.be.undefined;
  });

  it('verifies email and returns access token', async () => {
    const email = `verify${Date.now()}@example.com`;
    const user = await app.service('users').create({ email });

    const response = await app.service('users').verifyEmail(user.verificationToken);
    expect(response.message).to.equal('Email verified successfully.');
    expect(response.accessToken).to.not.be.undefined;

    const decoded = jwt.verify(response.accessToken, process.env.JWT_SECRET);
    expect(decoded.userId).to.equal(user._id.toString());
  });

  it('creates a user with Google OAuth', async () => {
    const email = `google${Date.now()}@example.com`;
    const googleId = `googleId${Date.now()}`;
    const user = await app.service('users').create({ email, googleId });

    expect(user).to.include({ email, googleId });
    expect(user.name).to.equal(email);
    expect(user.isVerified).to.be.true;
  });

  it('prevents creating a user with existing email or googleId', async () => {
    const email = `duplicate${Date.now()}@example.com`;
    const googleId = `duplicateGoogleId${Date.now()}`;
    await app.service('users').create({ email, googleId });

    try {
      await app.service('users').create({ email });
    } catch (error) {
      expect(error.message).to.equal('Email or Google ID already exists');
    }

    try {
      await app.service('users').create({ googleId });
    } catch (error) {
      expect(error.message).to.equal('Email or Google ID already exists');
    }
  });

  it('hashes the password before saving the user', async () => {
    const email = `hash${Date.now()}@example.com`;
    const password = 'StrongPassw0rd!';
    const user = await app.service('users').create({ email, password });

    const isMatch = await bcrypt.compare(password, user.password);
    expect(isMatch).to.be.true;
  });
});
