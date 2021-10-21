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
    /* Always block requests when circuit is OPEN*/
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

  /* Increement failures then allow request or OPEN the circuit*/
  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
      console.log(`ALERT! Request retry will happen after ${state.nextTry}`);
    }
  }

  canRequest(endpoint) {
    /* Store current request info in state object*/
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    /* Always allow if the circuit   is CLOSED*/
    if (state.circuit === "CLOSED") return true;
    /* Retry when circuit HALF OPEN*/
    const requestTime = new Date() / 1000;
    if (state.nextTry <= requestTime) {
      state.circuit = "HALF";
      return true;
    }
    /* Block all request if the circuit is OPEN*/
    return false;
  }
}

module.exports = CircuitBreaker;
