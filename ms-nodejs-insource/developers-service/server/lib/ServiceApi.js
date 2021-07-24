const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

class Developers {
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getProfiles() {
    const data = await this.getDevelopers();

    return data.map((dev) => ({
      name: dev.name,
      username: dev.username,
      account: dev.github_account
    }));
  }

  async getAllDevs() {
    const data = await this.getDevelopers();
    return data.map((dev) => ({
      name: dev.name,
      username: dev.username,
      title: dev.job_title,
      bio: dev.bio,
    }));
  }

  async getAllProjects() {
    const data = await this.getDevelopers();
    const projects = data.reduce((k, v) => {
      if (v.projects) {
        k = [...k, ...v.projects];
      }
      return k;
    }, []);
    return projects;
  }

  async getDeveloper(username) {
    const data = await this.getDevelopers();
    const dev = data.find((current) => current.username === username);
    if (!dev) return null;
    return {
      title: dev.job_title,
      name: dev.name,
      username: dev.username,
      bio: dev.bio,
    };
  }

  async getDeveloperProjects(username) {
    const data = await this.getDevelopers();
    const dev = data.find((current) => current.username === username);
    if (!dev || !dev.projects) return null;
    return dev.projects;
  }

  async getDevelopers() {
    const data = await readFile(this.datafile, "utf8");
    if (!data) return [];
    return JSON.parse(data).developers;
  }
}

module.exports = Developers;
