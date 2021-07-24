/**
 * This module creates an express app, registers all the routes and defines middleware functions.
 * This module uses ServiceRegistry utility functions to handles requests
 */
const express = require("express");
const ServiceRegistry = require("./lib/ServiceRegistry");

const appService = express();

module.exports = (config) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(log);
  /* Add a request logging middleware in development mode */
  if (appService.get("env") === "development") {
    appService.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  appService
    .route("/register/:serviceName/:serviceVersion/:servicePort")
    .put((req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      const serviceIP = req.connection.remoteAddress.includes("::")
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const serviceKey = serviceRegistry.registerService(
        serviceName,
        serviceVersion,
        serviceIP,
        servicePort
      );
      return res.json({ result: serviceKey });
    })
    .delete((req, res) => {
      const { serviceName, serviceVersion, servicePort } = req.params;

      const serviceIP = req.connection.remoteAddress.includes("::")
        ? `[${req.connection.remoteAddress}]`
        : req.connection.remoteAddress;

      const serviceKey = serviceRegistry.unregisterService(
        serviceName,
        serviceVersion,
        serviceIP,
        servicePort
      );
      return res.json({ result: serviceKey });
    });

  appService.get("/find/:serviceName/:serviceVersion", (req, res) => {
    const { serviceName, serviceVersion } = req.params;
    const svc = serviceRegistry.getService(serviceName, serviceVersion);
    if (!svc) return res.status(404).json({ result: "Service not found" });
    return res.json(svc);
  });

  appService.use((error, req, res, next) => {
    res.status(error.status || 500);
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return appService;
};
