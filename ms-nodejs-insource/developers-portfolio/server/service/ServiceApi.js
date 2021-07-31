const axios = require('axios');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();
class DeveloperService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.devsServiceName = 'developers-service'
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
    return circuitBreaker.callService(requestOptions);
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = DeveloperService;
