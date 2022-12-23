let MissingPropertyError

/**
 * Error class for missing script or user properties.
 * @extends Error
 * @return {Class} The error class.
 */
function MissingPropertyError_() {
  if (MissingPropertyError === undefined) MissingPropertyError = class MissingPropertyError extends Error {
    /**
     * Create a missing property error object.
     * @param {String} propertyKey - The property key.
     */
    constructor(propertyKey) {
      super(`You must create a property with the key '${propertyKey}' in order to use this method`)
      super.name = this.constructor.name
    }
  }

  return MissingPropertyError
}

let InvalidResponseError

/**
 * Error class for invalid responses.
 * @extends Error
 * @return {Class} The error class.
 */
function InvalidResponseError_() {
  if (InvalidResponseError === undefined) InvalidResponseError = class InvalidResponseError extends Error {
    /**
     * Create an invalid response error object.
     * @param {String} response - The response.
     */
    constructor(response) {
      super(`Unexpected response : ${response}`)
      super.name = this.constructor.name
    }
  }

  return InvalidResponseError
}
