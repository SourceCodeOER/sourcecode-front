const config =  require('config');

// Import and Set Nuxt.js options
const defaultConfig = require('../../nuxt.config.js');

// Place extended config here
const extendedConfig = {};

// (Shallow) extend Nuxt.js config here
const nuxtConfig = {
  ...defaultConfig,
  ...extendedConfig
};

// Do final object manipulation for things where
// extending objects is not appropriate
if (nuxtConfig.proxy && nuxtConfig.proxy['/api/'] && nuxtConfig.proxy['/auth/']) {
  nuxtConfig.proxy['/api/'].target = config.get('API_SERVER');
  nuxtConfig.proxy['/auth/'].target = config.get('API_SERVER');
}

module.exports = nuxtConfig;
