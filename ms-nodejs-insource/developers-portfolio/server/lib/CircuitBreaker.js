const axios = require("axios");

class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 5; /*how long before the circuit opens*/
    this.cooldownPeriod = 10; /*how long before request retry*/
    this.requestTimeout = 0.000001; /*how long before before a request is considered failed*/
  }

  async callService(requestOptions) {
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    if (!this.canRequest(endpoint)) return false;

    // eslint-disable-next-line no-param-reassign
    requestOptions.timeout = this.requestTimeout * 1000;

    try {
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch (err) {
      this.onFailure(endpoint);
      return false;
    }
  }

  initState(endpoint) {
    this.states[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: "CLOSED",
      nextTry: 0,
    };
  }

  onSuccess(endpoint) {
    this.initState(endpoint);
  }

  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
      console.log(
        `ALERT! Request retry will happen after ${state.nextTry} seconds`
      );
    }
  }

  canRequest(endpoint) {
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    if (state.circuit === "CLOSED") return true;
    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = "HALF";
      return true;
    }
    return false;
  }
}

module.exports = CircuitBreaker;
