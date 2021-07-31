/**
 * This class has all the utility functions to
 * REGISTER, UPDATE, RETRIEVE and UNREGISTER the different micro services
 * Semver is used for semantic versioning
 */

const semver = require("semver");

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 3000;
  }

  getService(name, version) {
    this.cleanup();
    const requestedServiceCandidates = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );

    return requestedServiceCandidates[
      Math.floor(Math.random() * requestedServiceCandidates.length)
    ];
  }

  registerService(name, version, ip, port) {
    this.cleanup();
    const key = name + version + ip + port;

    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].name = name;
      this.services[key].version = version;
      this.log.debug(
        `Added services ${name}, version ${version} at ${ip}:${port}`
      );
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(
      `Updated services ${name}, version ${version} at ${ip}:${port}`
    );
    return key;
  }

  unregisterService(name, version, ip, port) {
    const key = name + version + ip + port;
    delete this.services[key];
    this.log.debug(
      `Unregistered services ${name}, version ${version} at ${ip}:${port}`
    );
    return key;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
