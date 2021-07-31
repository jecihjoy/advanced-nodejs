const express = require('express');

const service = express();

const DeveloperService = require('./service/ServiceApi');

module.exports = (config) => {
  const log = config.log();

  const devs = new DeveloperService(config);

  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.get('/developers', async (req, res, next) => {
    try {
      return res.json(await devs.getDevelopers());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/developers/profiles', async (req, res, next) => {
    try {
      return res.json(await devs.getProfiles());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/developers/projects', async (req, res, next) => {
    try {
      return res.json(await devs.getAllProjects());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/developers/:username', async (req, res, next) => {
    try {
      return res.json(await devs.getDeveloper(req.params.username));
    } catch (err) {
      return next(err);
    }
  });

  service.get('/developers/projects/:username', async (req, res, next) => {
    try {
      return res.json(await devs.getDeveloperProjects(req.params.username));
    } catch (err) {
      return next(err);
    }
  });

  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
