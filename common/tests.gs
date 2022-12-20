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
      this._testResults = []
    }

    /** Log the overall result of the tests ran. */
    logResult() {
      const passedResults = this._testResults.filter(testResult => testResult === true)
      console.log(`${passedResults.length} out of ${this._testResults.length} tests passed`)
    }

    /** Run all tests. Individual successes and failures will be logged. */
    testAll() {
      this.testCommons()
      this.testChannels()
      this.testPlaylists()
      this.testSheets()
      this.testVideos()
    }

    /** Run common tests. */
    testCommons() {
      this.testCommonUtils()
      this.testCommonYoutubeService()
      this.testCommonDatabaseService()
    }

    /** Run common utility tests. */
    testCommonUtils() {
      this.test_("TEST", true)
    }

    /** Run common YouTube API service tests. */
    testCommonYoutubeService() {
      this.test_("TEST", true)
    }

    /** Run common database API service tests. */
    testCommonDatabaseService() {
      this.test_("TEST", true)
    }

    /** Run channel tests. */
    testChannels() {
      this.testChannelService()
      this.testChannelModel()
    }

    /** Run channel service tests. */
    testChannelService() {
      this.test_("TEST", true)
    }

    /** Run channel model tests. */
    testChannelModel() {
      this.test_("TEST", true)
    }

    /** Run playlist tests. */
    testPlaylists() {
      this.testPlaylistService()
      this.testPlaylistModel()
    }

    /** Run playlist service tests. */
    testPlaylistService() {
      this.test_("TEST", true)
    }

    /** Run playlist model tests. */
    testPlaylistModel() {
      this.test_("TEST", true)
    }

    /** Run sheet and spreadsheet tests. */
    testSheets() {
      this.testSpreadsheetService()
      this.testSpreadsheetModel()
      this.testSheetModel()
    }

    /** Run spreadsheet service tests. */
    testSpreadsheetService() {
      this.test_("TEST", true)
    }

    /** Run spreadsheet model tests. */
    testSpreadsheetModel() {
      this.test_("TEST", true)
    }

    /** Run sheet model tests. */
    testSheetModel() {
      this.test_("TEST", true)
    }

    /** Run video tests. */
    testVideos() {
      this.testVideoService()
      this.testVideoModel()
    }

    /** Run video service tests. */
    testVideoService() {
      this.test_("TEST", true)
    }

    /** Run video model tests. */
    testVideoModel() {
      this.test_("TEST", true)
    }

    /**
     * Run a test on a value and logs the result of the test.
     * If the expected value is provided, the test will pass if the actual value is equal to the expected value.
     * Otherwise, the test will pass if the actual value is not null or undefined.
     * @param {String} logMessage - A message to include in the test log.
     * @param {Object} actualValue - The value to test.
     * @param {Object} [expectedValue] - The optional expected value to compare to.
     */
    test_(logMessage, actualValue, expectedValue) {
      const testStatuses = {
        pass: "PASS",
        fail: "FAIL"
      }
      let testResult = testStatuses.fail
      let pass = false

      if (expectedValue !== undefined) {
        pass = (actualValue === expectedValue)
      } else {
        pass = (actualValue !== undefined && actualValue !== null)
      }

      if (pass === true) {
        testResult = testStatuses.pass
      }

      this._testResults.push(pass)
      console.log(`${testResult}: ${logMessage}`)
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
function runTests() {
  tests_().testAll()
  tests_().logResult()
}
