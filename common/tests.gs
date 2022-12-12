let Tests

/**
 * Testing class for static methods.
 * @return {Class} The tests class.
 */
function Tests_() {
  if (Tests === undefined) Tests = class Tests {
    /**
     * Create a tests object.
     */
    constructor() {
    }

    /**
     * Run all tests. All successes and failures will be logged.
     */
    testAll() {
      // TODO add tests
    }
  }

  return Tests
}

let theTests

/**
 * Get the tests.
 * return {Tests} The tests object.
 */
function tests_() {
  if (theTests === undefined) {
    theTests = new (Tests_())()
  }

  return theTests
}

/**
 * Manually run all tests.
 */
function runTests_() {
  tests_().testAll()
}
