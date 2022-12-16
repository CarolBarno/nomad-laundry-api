const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const { NotAuthenticated } = require('@feathersjs/errors');
const searchUserSession = require('./hooks/online-users/search-user-session');
const logger = require('./logger');
const saveSession = require('./hooks/online-users/save-session');
const getAcessToken = require('./hooks/online-users/get-access-token');
const removeSession = require('./hooks/online-users/remove-session');
const saveToken = require('./hooks/online-users/save-token');

class CustomAuthService extends AuthenticationService {
  constructor(app, configKey) {
    super(app, configKey);
  }

  getPly(cb) {

    const executeOnce = (() => {
      var executed = false;
      return function () {
        if (!executed) {
          executed = true;
          return true;
        } else {
          return false;
        }
      };
    })();

    this.app.on('login', (authResult) => {
      let saveAuthToken = executeOnce();

      if (authResult.authentication.strategy === 'local') {
        try {
          if (authResult && saveAuthToken) {
            cb(this.app, authResult);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async verifySession(payload, params) {
    if (payload.authentication.strategy === 'local') {

      const { headers } = params;

      let data = {
        time: `${new Date().toLocaleTimeString()}`,
        user: {
          userId: payload.user.id,
          name: `${payload.user.first_name} ${payload.user.last_name}`,
          email: payload.user.email,
          phone_number: payload.user.phone_number
        },
        userAgent: headers['user-agent']
      };


      let storedSession = await searchUserSession(this.app, payload.user);

      if (storedSession) {
        logger.info('Failed login', data);
        throw new CustomError(`Sorry! You are already signed in on a different device.\n
        Please sign out in order to sign in on this device.`, 412);
      } else if (payload.user.user_status === 'I') {
        logger.info('Failed login', data);
        throw new CustomError('Sorry! Your account is inactive, please contact us.', 413);
      } else if (payload.user.user_status === 'D') {
        logger.info('Failed login', data);
        throw new CustomError('Sorry! Your account is deleted, please contact us.', 413);
      } else if (payload.user.user_status === 'B') {
        logger.info('Failed login', data);
        throw new CustomError('Sorry! Your account is blacklisted, please contact us.', 413);
      } else {
        if (payload.user.user_status === 'A' || payload.user.user_status === 'P') {
          logger.info('Successful login', data);
          this.getPly(async (a, b) => {
            try {
              await saveSession(a, b);
            } catch (error) {
              console.log('session already saved');
            }
          });
        } else {
          logger.info('Failed login', data);
          throw new CustomError('Sorry! There was a problem trying to login,please contact us.', 413);
        }
      }
    }

    return payload;
  }

  async getPayload(authResult, params) {
    const payload = await super.getPayload(authResult, params);
    await this.verifySession(authResult, params);
    return payload;
  }

  async remove(id, params) {
    let authRes = await super.remove(id, params);
    const { headers } = params;
    const { accessToken, user } = authRes;

    if (accessToken) {
      await this.revokeAccessToken(accessToken, user);
    }

    await removeSession(this.app, user);

    let data = {
      time: `${new Date().toLocaleTimeString()}`,
      user: {
        userId: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number
      },
      userAgent: headers['user-agent']
    };

    logger.info('Successful logout', data);

    return authRes;
  }

  async revokeAccessToken(accessToken, user) {
    const verified = await this.verifyAccessToken(accessToken);
    const auth = {
      user,
      accessToken
    };
    try {
      await saveToken(this.app, auth);
    } catch (error) {
      logger.error('error', error);
    }

    return verified;
  }

  async verifyAccessToken(accessToken) {
    let revoked = await getAcessToken(this.app, accessToken);
    if (revoked) {
      throw new NotAuthenticated('Invalid session');
    }
    return super.verifyAccessToken(accessToken);
  }
}

class CustomError extends NotAuthenticated {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.data = { multipleSessions: true };
  }
}

module.exports = app => {
  const authentication = new CustomAuthService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
