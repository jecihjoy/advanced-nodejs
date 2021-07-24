#!/usr/bin/env node

const http = require('http');
const app = require('express');

const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const log = config.log();
const service = require('../server/AppServer')(config);

const server = http.createServer(app);

/* a service should not have a fixed port but should randomly choose one */
server.listen(process.env.PORT || 3000);

server.on('listening', () => {
  log.info(
    `Hi there! I'm listening on port ${server.address().port} in ${service.get('env')} mode.`,
  );
});
