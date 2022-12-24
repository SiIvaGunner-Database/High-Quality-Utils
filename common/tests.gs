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
      this._channelId = "UCCPGE1kAoonfPsbieW41ZZA" // VvvvvaVvvvvvr
      this._playlistId = "PLC2x5lNg_Y5Nsw1EKWGzHq5-VdzpJHWAR" // HuniePop
      this._spreadsheetId = "1JhARnRkPEtwGFGgmxIBFoWixB7QR2K_toz38-tTHDOM" // Copy of SiIvaGunner Bootlegs Database
      this._videoId = "NzoneDE0A2o" // The Inn - Fire Emblem
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
      console.log("TESTING COMMON UTILS")
      const pageName = "Test Name - { [ \" ' + ' \" ] }"
      this.test_("formatDate", formatDate(new Date()))
      this.test_("formatLength", formatLength("PT1H43M1S"))
      this.test_("formatYoutubeHyperlink", formatYoutubeHyperlink(this._videoId))
      this.test_("formatFandomHyperlink", formatFandomHyperlink(pageName, "siivagunner"))
      this.test_("formatFandomPageName", formatFandomPageName(pageName))
      this.test_("logAlert", logAlert("You can shut up now."))
    }

    /** Run common YouTube API service tests. */
    testCommonYoutubeService() {
      console.log("TESTING COMMON YOUTUBE SERVICE")
      const testPlaylistId = "PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F"
      this.test_("getStatuses", getStatuses())
      this.test_("getChannel", getChannel(this._channelId))
      this.test_("getChannels", getChannels([this._channelId, "UC6ajqR7lEYf-33Gsj4lgVOA"]))
      this.test_("getPlaylist", getPlaylist(this._playlistId))
      this.test_("getPlaylists", getPlaylists([this._playlistId, "PLL0CQjrcN8D38CfZ2TuZUbb6lreHbSHSL"]))
      this.test_("addToPlaylist", addToPlaylist(testPlaylistId, this._videoId))
      this.test_("removeFromPlaylist", removeFromPlaylist(testPlaylistId, this._videoId))
      this.test_("getPlaylistItems", getPlaylistItems(this._playlistId, 100))
      this.test_("getVideo", getVideo(this._videoId))
      this.test_("getVideos", getVideos([this._videoId, "TP4XBFo8GoQ"]))
    }

    /** Run common database API service tests. */
    testCommonDatabaseService() {
      console.log("TESTING COMMON DATABASE SERVICE")
      const apiPath = "channels"
      const data = { id: "id" }
      this.test_("getDomain", database().getDomain())
      this.test_("getData", database().getData(apiPath))
      this.test_("postData", database().postData(apiPath, data))
      data.title = "title"
      this.test_("putData", database().putData(apiPath, data))
      this.test_("deleteData", database().deleteData(apiPath, data))
    }

    /** Run channel tests. */
    testChannels() {
      this.testChannelService()
      this.testChannelModel()
    }

    /** Run channel service tests. */
    testChannelService() {
      console.log("TESTING CHANNEL SERVICE")
      // Inherited functions
      this.test_("getApiPath", channels().getApiPath(this._channelId))
      this.test_("getById", channels().getById(this._channelId))
      this.test_("getAll", channels().getAll())
      this.test_("getAllChanges", channels().getAllChanges())
      this.test_("hasAnyChanges", channels().hasAnyChanges())
      this.test_("updateAll", channels().updateAll(false))
    }

    /** Run channel model tests. */
    testChannelModel() {
      console.log("TESTING CHANNEL MODEL")
      const channel = channels().getById(this._channelId)
      // Inherited functions
      this.test_("getColumnConfig", channel.getColumnConfig())
      this.test_("getId", channel.getId())
      this.test_("getBaseObject", channel.getBaseObject())
      this.test_("getDatabaseObject", channel.getDatabaseObject())
      this.test_("getChanges", channel.getChanges())
      this.test_("hasChanges", channel.hasChanges())
      this.test_("update", channel.update(false))
      // Custom functions
      this.test_("getSpreadsheet", channel.getSpreadsheet())
      this.test_("getSheet", channel.getSheet())
      this.test_("getPlaylists", channel.getPlaylists())
      this.test_("getVideos", channel.getVideos(100))
      this.test_("getYoutubeStatus", channel.getYoutubeStatus())
    }

    /** Run playlist tests. */
    testPlaylists() {
      this.testPlaylistService()
      this.testPlaylistModel()
    }

    /** Run playlist service tests. */
    testPlaylistService() {
      console.log("TESTING PLAYLIST SERVICE")
      // Inherited functions
      this.test_("getApiPath", playlists().getApiPath(this._playlistId))
      this.test_("getById", playlists().getById(this._playlistId))
      this.test_("getAll", playlists().getAll())
      this.test_("getAllChanges", playlists().getAllChanges())
      this.test_("hasAnyChanges", playlists().hasAnyChanges())
      this.test_("updateAll", playlists().updateAll(false))
    }

    /** Run playlist model tests. */
    testPlaylistModel() {
      console.log("TESTING PLAYLIST MODEL")
      const playlist = playlists().getById(this._playlistId)
      const testPlaylist = playlists().getById("PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F")
      // Inherited functions
      this.test_("getColumnConfig", playlist.getColumnConfig())
      this.test_("getId", playlist.getId())
      this.test_("getBaseObject", playlist.getBaseObject())
      this.test_("getDatabaseObject", playlist.getDatabaseObject())
      this.test_("getChanges", playlist.getChanges())
      this.test_("hasChanges", playlist.hasChanges())
      this.test_("update", playlist.update(false))
      // Custom functions
      this.test_("getSpreadsheet", playlist.getSpreadsheet())
      this.test_("getChannel", playlist.getChannel())
      this.test_("getVideos", playlist.getVideos(100))
      this.test_("addVideo", testPlaylist.addVideo(this._videoId))
      this.test_("removeVideo", testPlaylist.removeVideo(this._videoId))
      this.test_("getYoutubeStatus", playlist.getYoutubeStatus())
    }

    /** Run sheet and spreadsheet tests. */
    testSheets() {
      this.testSpreadsheetService()
      this.testSpreadsheetModel()
      this.testSheetModel()
    }

    /** Run spreadsheet service tests. */
    testSpreadsheetService() {
      console.log("TESTING SPREADSHEET SERVICE")
      // Inherited functions
      this.test_("getApiPath", spreadsheets().getApiPath(this._spreadsheetId))
      this.test_("getById", spreadsheets().getById(this._spreadsheetId))
      this.test_("getAll", spreadsheets().getAll())
      this.test_("getAllChanges", spreadsheets().getAllChanges())
      this.test_("hasAnyChanges", spreadsheets().hasAnyChanges())
      this.test_("updateAll", spreadsheets().updateAll(false))
    }

    /** Run spreadsheet model tests. */
    testSpreadsheetModel() {
      console.log("TESTING SPREADSHEET MODEL")
      const spreadsheet = spreadsheets().getById(this._spreadsheetId)
      // Inherited functions
      this.test_("getColumnConfig", spreadsheet.getColumnConfig())
      this.test_("getId", spreadsheet.getId())
      this.test_("getBaseObject", spreadsheet.getBaseObject())
      this.test_("getDatabaseObject", spreadsheet.getDatabaseObject())
      this.test_("getChanges", spreadsheet.getChanges())
      this.test_("hasChanges", spreadsheet.hasChanges())
      this.test_("update", spreadsheet.update(false))
      // Custom functions
      this.test_("getSheet", spreadsheet.getSheet("1d!eCI0ak"))
    }

    /** Run sheet model tests. */
    testSheetModel() {
      console.log("TESTING SHEET MODEL")
      const sheet = spreadsheets().getById(this._spreadsheetId).getSheet("1d!eCI0ak")
      const data = videos().getById(this._videoId)
      this.test_("getBaseObject", sheet.getBaseObject())
      this.test_("getSpreadsheet", sheet.getSpreadsheet())
      this.test_("getValues", sheet.getValues())
      this.test_("insertValues", sheet.insertValues(data))
      this.test_("updateValues", sheet.updateValues(data, 2))
      this.test_("sort", sheet.sort(data.getColumnConfig().sortColumn, false))
    }

    /** Run video tests. */
    testVideos() {
      this.testVideoService()
      this.testVideoModel()
    }

    /** Run video service tests. */
    testVideoService() {
      console.log("TESTING VIDEO SERVICE")
      // Inherited functions
      this.test_("getApiPath", videos().getApiPath(this._videoId))
      this.test_("getById", videos().getById(this._videoId))
      this.test_("getAll", videos().getAll())
      this.test_("getAllChanges", videos().getAllChanges())
      this.test_("hasAnyChanges", videos().hasAnyChanges())
      this.test_("updateAll", videos().updateAll(false))
    }

    /** Run video model tests. */
    testVideoModel() {
      console.log("TESTING VIDEO MODEL")
      // Inherited functions
      const video = videos().getById(this._videoId)
      this.test_("getColumnConfig", video.getColumnConfig())
      this.test_("getId", video.getId())
      this.test_("getBaseObject", video.getBaseObject())
      this.test_("getDatabaseObject", video.getDatabaseObject())
      this.test_("getChanges", video.getChanges())
      this.test_("hasChanges", video.hasChanges())
      this.test_("update", video.update(false))
      // Custom functions
      this.test_("getChannel", video.getChannel())
      this.test_("getYoutubeStatus", video.getYoutubeStatus())
      this.test_("getWikiStatus", video.getWikiStatus())
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
      console.log(`${testResult}: ${logMessage} (${actualValue.toString().substring(0, 50)})`)
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
  settings().enableDevMode()
  tests_().testAll()
  tests_().logResult()
}
