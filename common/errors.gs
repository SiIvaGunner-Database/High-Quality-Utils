let MissingPropertyError;

/**
 * Error class for missing script or user properties.
 * @extends Error
 * @return {Class} The error class.
 */
function MissingPropertyError_() {
  if (MissingPropertyError === undefined) MissingPropertyError = class MissingPropertyError extends Error {
    /**
     * Create a missing property error object.
     * @param {String} propertyKey The property key.
     */
    constructor(propertyKey) {
      super(`You must create a property with the key '${propertyKey}' in order to use this method`)
    }
  }

  return MissingPropertyError;
}

let RequiredParameterError;

/**
 * Error class for required parameters.
 * @extends Error
 * @return {Class} The error class.
 */
function RequiredParameterError_() {
  if (RequiredParameterError === undefined) RequiredParameterError = class RequiredParameterError extends Error {
    /**
     * Create a required paramter error object.
     * @param {String} propertyKey The property key.
     */
    constructor(parameterName) {
      super(`'${parameterName}' can not be null or undefined`)
    }
  }

  return RequiredParameterError;
}

let InvalidParameterTypeError;

/**
 * Error class for invalid parameter types.
 * @extends Error
 * @return {Class} The error class.
 */
function InvalidParameterTypeError_() {
  if (InvalidParameterTypeError === undefined) InvalidParameterTypeError = class InvalidParameterTypeError extends Error {
    /**
     * Create an invalid parameter type error object.
     * @param {String} givenType The given parameter type.
     * @param {String} expectedType The expected parameter type.
     */
    constructor(givenType, expectedType) {
      super(`Invalid parameter of type '${givenType}' when expecting '${expectedType}' type`)
    }
  }

  return InvalidParameterTypeError;
}
