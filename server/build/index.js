const {Nuxt, Builder} = require('nuxt');
const config = require('./../utils/extendedNuxtConfig.js');

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production';

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);
  // Build only in dev mode
  await nuxt.ready();

  const builder = new Builder(nuxt);
  await builder.build();
}

start();
