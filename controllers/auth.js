const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');

const config = require('../config');

//Auth middleware will check auth tokens in headers
exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: config.JWKS_URI,
  }),
  audience: config.AUTH0_AUDIENCE,
  issuer: config.AUTH0_ISSUER,
  algorithms: ['RS256'],
});

exports.checkRole = role => (req, res, next) => {
  const user = req.user;
  if (user[config.AUTHO0_NAMESPACE + '/roles'].includes(role)) return next();

  return res
    .status(401)
    .send('You are not authorized to access this resource.');
};

exports.getAccessToken = () => {
  const options = {
    method: 'POST',
    url: config.AUTH0_TOKEN_URL,
    headers: { 'content-type': 'application/json' },
    form: {
      grant_type: 'client_credentials',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: config.AUTH0_AUDIENCE,
    },
  };

  return authCompleteRequest(options);
};

exports.getAuth0User = (token, id) => {
  const options = {
    method: 'GET',
    url: `${config.AUTH0_DOMAIN}/api/v2/users/${id}?fields=name,picture,user_id`,
    headers: { authorization: `Bearer ${token}` },
  };

  return authCompleteRequest(options);
};

authCompleteRequest = options =>
  new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        return reject(new Error(error));
      }

      resolve(body ? JSON.parse(body) : '');
    });
  });
