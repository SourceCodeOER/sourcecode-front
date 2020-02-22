const config = require('config');

/**
 * Set up object that will be available to both server and client.
 * For the sake of simplicity, please keep this object flat.
 * Be extra diligent about not leaking any sensitive info here!!
 *
 * @type       {Object}
 */
const sharedEnv = {
  API_SERVER: config.get("api_server"),
  CDN_SERVER: config.get("cdn_server")
};

module.exports = sharedEnv;
