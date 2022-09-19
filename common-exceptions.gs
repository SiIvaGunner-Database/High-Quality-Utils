/**
 * Error class for missing script or user properties.
 */
class MissingPropertyError extends Error {

  /**
   * Creates a missing property error object.
   *
   * @param {String} propertyKey The script property key.
   */
  constructor(propertyKey) {
    super(`You must create a property with the key '${propertyKey}' in order to use this method`);
  }

}

/**
 * Error class for invalid parameter types.
 */
class InvalidParameterTypeError extends TypeError {

  /**
   * Creates a invalid parameter type error object.
   *
   * @param {String} givenType The given parameter type.
   * @param {String} expectedType The expected parameter type.
   */
  constructor(givenType, expectedType) {
    super(`Invalid parameter of type '${givenType}' when expecting '${expectedType}'' type`);
  }

}

