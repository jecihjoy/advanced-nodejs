#!/usr/bin/env node

const http = require('http');
const axios = require('axios');

const config = require('../config/config.js')[process.env.NODE_ENV || 'development'];

const log = config.log();
const service = require('../server/AppServer')(config);

const server = http.createServer(service);

/* a service should not have a fixed port but should randomly choose one */
server.listen(0);

server.on('listening', () => {
  const registerService = () => axios.put(`http://localhost:3000/register/${config.name}/${config.version}/${server.address().port}`);
  const unregisterService = () => axios.delete(`http://localhost:3000/register/${config.name}/${config.version}/${server.address().port}`);

  registerService();

  const interval = setInterval(registerService, 2000);
  const cleanup = async () => {
    clearInterval(interval);
    await unregisterService();
  };

  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  /** CTR+C exit */
  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  /** Testing  uncaughtException*/
  // setTimeout(() => {
  //   throw new Error('Something happened');
  // }, 10000);

  log.info(
    `Hi there! I'm listening on port ${server.address().port} in ${service.get('env')} mode.`,
  );
});
