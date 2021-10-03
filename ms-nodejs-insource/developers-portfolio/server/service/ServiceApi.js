const axios = require('axios');
const url = require('url');
const crypto = require('crypto');

const CircuitBreaker = require('../lib/CircuitBreaker');
const opossumCB = require ('opossum');

const circuitBreaker = new CircuitBreaker();
class DeveloperService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.devsServiceName = 'developers-service'
    this.cache = {};
  }


  async getDevelopers() {
    const { ip, port } = await this.getService(this.devsServiceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/developers`,
    });
  }

  async getProfiles() {
    const { ip, port } = await this.getService(this.devsServiceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/developers/profiles`,
    });
  }

  async getAllProjects() {
    const { ip, port } = await this.getService(this.devsServiceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/developers/projects`,
    });
  }

  async getDeveloper(username) {
    const { ip, port } = await this.getService(this.devsServiceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/developers/${username}`,
    });
  }

  async getDeveloperProjects(username) {
    const { ip, port } = await this.getService(this.devsServiceName);
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/developers/projects/${username}`,
    });
  }

  async callService(requestOptions) {
    const servicePath = url.parse(requestOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + servicePath).digest('hex');
    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) return this.cache[cacheKey];
      return false;
    }

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = DeveloperService;
