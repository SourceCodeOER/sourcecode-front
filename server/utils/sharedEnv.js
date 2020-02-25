const config = require('config');

/**
 * Set up object that will be available to both server and client.
 * For the sake of simplicity, please keep this object flat.
 * Be extra diligent about not leaking any sensitive info here!!
 *
 * @type       {Object}
 */
const sharedEnv = {
  API_SERVER: config.get("API_SERVER"),
  CDN_SERVER: config.get("CDN_SERVER")
};

module.exports = sharedEnv;
