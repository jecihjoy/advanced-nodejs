const axios = require('axios');

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
    const response = await axios(requestOptions);
    return response.data;
  }

  async getService(servicename) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = DeveloperService;
