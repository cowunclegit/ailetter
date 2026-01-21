class ProxyError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ProxyError';
    this.details = details;
  }
}

class ProxyAuthenticationError extends ProxyError {
  constructor(message, details = {}) {
    super(message, details);
    this.name = 'ProxyAuthenticationError';
  }
}

class ProxyConnectionError extends ProxyError {
  constructor(message, details = {}) {
    super(message, details);
    this.name = 'ProxyConnectionError';
  }
}

module.exports = {
  ProxyError,
  ProxyAuthenticationError,
  ProxyConnectionError,
};