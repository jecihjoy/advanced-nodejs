const bunyan = require('bunyan');
const path = require('path');
// Load package.json
const pjs = require('../package.json');

// Get some meta info from the package.json
const { name, version } = pjs;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'debug')
  },
  production: {
    name,
    version,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'info')
  },
  test: {
    name,
    version,
    serviceRegistryUrl: 'http://localhost:3000',
    serviceVersionIdentifier: '1.x.x',
    log: () => getLogger(name, version, 'fatal')
  },
};
