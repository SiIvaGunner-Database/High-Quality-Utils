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
      this._spreadsheetId = "1HP9FdYkb1Kuqcq-ND69yG1ojqCLYSRoVfF-KwlNdIuM" // SiIvaGunner Playground
      this._videoId = "NzoneDE0A2o" // The Inn - Fire Emblem
      this._limit = 50
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
      const object = {"a": {"b": "c"}}

      // Custom functions
      this.test_("utils.capitalizeString", utils().capitalizeString())
      this.test_("utils.stringifySortedObject", utils().stringifySortedObject(object))
      this.test_("utils.sortObject", utils().sortObject(object))
      this.test_("utils.formatDate", utils().formatDate())
      this.test_("utils.formatLength", utils().formatLength("PT1H43M1S"))
      this.test_("utils.formatHyperlink", utils().formatHyperlink("siivagunnerdatabase.net", "siivagunnerdb"))
      this.test_("utils.formatYoutubeHyperlink", utils().formatYoutubeHyperlink(this._videoId))
      this.test_("utils.formatFandomHyperlink", utils().formatFandomHyperlink(pageName, "siivagunner"))
      this.test_("utils.formatFandomPageName", utils().formatFandomPageName(pageName))
      this.test_("utils.fetchFandomCategoryMembers", utils().fetchFandomCategoryMembers("siivagunner", "Rips featuring..."))
      this.test_("utils.fetchFandomVideoId", utils().fetchFandomVideoId("siivagunner", "The Inn - Fire Emblem"))
      this.test_("utils.logAlert", utils().logAlert("You can shut up now."))
    }

    /** Run common YouTube API service tests. */
    testCommonYoutubeService() {
      console.log("TESTING COMMON YOUTUBE SERVICE")
      const testPlaylistId = "PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F"

      // Custom functions
      this.test_("youtube.getStatuses", youtube().getStatuses())
      this.test_("youtube.getChannel", youtube().getChannel(this._channelId))
      this.test_("youtube.getChannels", youtube().getChannels([this._channelId, "UC6ajqR7lEYf-33Gsj4lgVOA"]))
      this.test_("youtube.getChannelPlaylists", youtube().getChannelPlaylists(this._channelId, this._limit))
      this.test_("youtube.getChannelVideos", youtube().getChannelVideos(this._channelId, this._limit))
      this.test_("youtube.getPlaylist", youtube().getPlaylist(this._playlistId))
      this.test_("youtube.getPlaylists", youtube().getPlaylists([this._playlistId, "PLL0CQjrcN8D38CfZ2TuZUbb6lreHbSHSL"]))
      this.test_("youtube.addToPlaylist", youtube().addToPlaylist(testPlaylistId, this._videoId))
      this.test_("youtube.removeFromPlaylist", youtube().removeFromPlaylist(testPlaylistId, this._videoId))
      this.test_("youtube.getPlaylistVideos", youtube().getPlaylistVideos(this._playlistId, this._limit))
      this.test_("youtube.getVideo", youtube().getVideo(this._videoId))
      this.test_("youtube.getVideos", youtube().getVideos([this._videoId, "TP4XBFo8GoQ"]))
    }

    /** Run common database API service tests. */
    testCommonDatabaseService() {
      console.log("TESTING COMMON DATABASE SERVICE")
      const apiPath = "channels"
      const data = { "id": "id" }

      // Custom functions
      this.test_("database.getDomain", database().getDomain())
      this.test_("database.getData", database().getData(apiPath))
      this.test_("database.postData", database().postData(apiPath, data))
      data.title = "title"
      this.test_("database.putData", database().putData(apiPath, data))
      this.test_("database.deleteData", database().deleteData(apiPath, data))
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
      this.test_("channels.getApiPath", channels().getApiPath(this._channelId))
      this.test_("channels.getById", channels().getById(this._channelId))
      this.test_("channels.getByFilter", channels().getByFilter())
      this.test_("channels.getAll", channels().getAll())
      this.test_("channels.updateAll", channels().updateAll(channels().getAll(), false))
    }

    /** Run channel model tests. */
    testChannelModel() {
      console.log("TESTING CHANNEL MODEL")
      const channel = channels().getById(this._channelId)

      // Inherited functions
      this.test_("channel.getColumnConfig", channel.getColumnConfig())
      this.test_("channel.getId", channel.getId())
      this.test_("channel.getOriginalObject", channel.getOriginalObject())
      this.test_("channel.getDatabaseObject", channel.getDatabaseObject())
      this.test_("channel.getChanges", channel.getChanges())
      this.test_("channel.hasChanges", channel.hasChanges())
      this.test_("channel.update", channel.update(false))
      this.test_("channel.createDatabaseObject", channel.createDatabaseObject({}, false))

      // Custom functions
      this.test_("channel.getSpreadsheet", channel.getSpreadsheet())
      this.test_("channel.getSheet", channel.getSheet())
      this.test_("channel.getChangelogSpreadsheet", channel.getChangelogSpreadsheet())
      this.test_("channel.getPlaylists", channel.getPlaylists(this._limit))
      this.test_("channel.getUndocumentedRipsPlaylist", channel.getUndocumentedRipsPlaylist())
      this.test_("channel.getVideos", channel.getVideos(this._limit))
      this.test_("channel.getYoutubeStatus", channel.getYoutubeStatus())
      this.test_("channel.getSpreadsheetHyperlink", channel.getSpreadsheetHyperlink())
      this.test_("channel.getWikiHyperlink", channel.getSpreadsheetHyperlink())
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
      this.test_("playlists.getApiPath", playlists().getApiPath(this._playlistId))
      this.test_("playlists.getById", playlists().getById(this._playlistId))
      this.test_("playlists.getByFilter", playlists().getByFilter())
      this.test_("playlists.getAll", playlists().getAll())
      this.test_("playlists.updateAll", playlists().updateAll(playlists().getAll(), false))

      // Custom functions
      this.test_("playlists.getByChannelId", playlists().getByChannelId(this._channelId, { "limit": this._limit }))
    }

    /** Run playlist model tests. */
    testPlaylistModel() {
      console.log("TESTING PLAYLIST MODEL")
      const playlist = playlists().getById(this._playlistId)
      const testPlaylist = playlists().getById("PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F")

      // Inherited functions
      this.test_("playlist.getColumnConfig", playlist.getColumnConfig())
      this.test_("playlist.getId", playlist.getId())
      this.test_("playlist.getOriginalObject", playlist.getOriginalObject())
      this.test_("playlist.getDatabaseObject", playlist.getDatabaseObject())
      this.test_("playlist.getChanges", playlist.getChanges())
      this.test_("playlist.hasChanges", playlist.hasChanges())
      this.test_("playlist.update", playlist.update(false))
      this.test_("playlist.createDatabaseObject", playlist.createDatabaseObject({}, false))

      // Custom functions
      this.test_("playlist.getSpreadsheet", playlist.getSpreadsheet())
      this.test_("playlist.getChannel", playlist.getChannel())
      this.test_("playlist.getVideos", playlist.getVideos(this._limit))
      this.test_("playlist.addVideo", testPlaylist.addVideo(this._videoId))
      this.test_("playlist.removeVideo", testPlaylist.removeVideo(this._videoId))
      this.test_("playlist.getYoutubeStatus", playlist.getYoutubeStatus())
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
      this.test_("spreadsheets.getApiPath", spreadsheets().getApiPath(this._spreadsheetId))
      this.test_("spreadsheets.getById", spreadsheets().getById(this._spreadsheetId))
      this.test_("spreadsheets.getByFilter", spreadsheets().getByFilter())
      this.test_("spreadsheets.getAll", spreadsheets().getAll())
      this.test_("spreadsheets.updateAll", spreadsheets().updateAll(spreadsheets().getAll(), false))
    }

    /** Run spreadsheet model tests. */
    testSpreadsheetModel() {
      console.log("TESTING SPREADSHEET MODEL")
      const spreadsheet = spreadsheets().getById(this._spreadsheetId)

      // Inherited functions
      this.test_("spreadsheet.getColumnConfig", spreadsheet.getColumnConfig())
      this.test_("spreadsheet.getId", spreadsheet.getId())
      this.test_("spreadsheet.getOriginalObject", spreadsheet.getOriginalObject())
      this.test_("spreadsheet.getDatabaseObject", spreadsheet.getDatabaseObject())
      this.test_("spreadsheet.getChanges", spreadsheet.getChanges())
      this.test_("spreadsheet.hasChanges", spreadsheet.hasChanges())
      this.test_("spreadsheet.update", spreadsheet.update(false))
      this.test_("spreadsheet.createDatabaseObject", spreadsheet.createDatabaseObject({}, false))

      // Custom functions
      this.test_("spreadsheet.getSheet", spreadsheet.getSheet("1d!eCI0ak"))
    }

    /** Run sheet model tests. */
    testSheetModel() {
      console.log("TESTING SHEET MODEL")
      const sheet = spreadsheets().getById(this._spreadsheetId).getSheet("1d!eCI0ak")
      const video = videos().getById(this._videoId)
      const channel = channels().getById(this._channelId)
      const values = video.getValues(channel.getDatabaseObject().wiki)

      // Custom functions
      this.test_("sheet.getOriginalObject", sheet.getOriginalObject())
      this.test_("sheet.getSpreadsheet", sheet.getSpreadsheet())
      this.test_("sheet.getValues", sheet.getValues())
      this.test_("sheet.getRowIndexOfValue", sheet.getRowIndexOfValue(this._videoId))
      // this.test_("sheet.create", sheet.create("Sheet"))
      this.test_("sheet.insertValues", sheet.insertValues(values))
      this.test_("sheet.updateValues", sheet.updateValues(values, 2))
      this.test_("sheet.sort", sheet.sort(video.getColumnConfig().sortColumn, false))
      this.test_("sheet.format", sheet.format(["Column"]))
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
      this.test_("videos.getApiPath", videos().getApiPath(this._videoId))
      this.test_("videos.getById", videos().getById(this._videoId))
      this.test_("videos.getByFilter", videos().getByFilter())
      this.test_("videos.getAll", videos().getAll())
      this.test_("videos.updateAll", videos().updateAll(videos().getAll(), false))

      // Custom functions
      this.test_("videos.getByChannelId", videos().getByChannelId(this._channelId, { "limit": this._limit }))
      this.test_("videos.getByPlaylistId", videos().getByPlaylistId(this._playlistId, { "limit": this._limit }))
    }

    /** Run video model tests. */
    testVideoModel() {
      console.log("TESTING VIDEO MODEL")

      // Inherited functions
      const video = videos().getById(this._videoId)
      this.test_("video.getColumnConfig", video.getColumnConfig())
      this.test_("video.getId", video.getId())
      this.test_("video.getOriginalObject", video.getOriginalObject())
      this.test_("video.getDatabaseObject", video.getDatabaseObject())
      this.test_("video.getChanges", video.getChanges())
      this.test_("video.hasChanges", video.hasChanges())
      this.test_("video.update", video.update(false))
      this.test_("video.createDatabaseObject", video.createDatabaseObject({}, false))

      // Custom functions
      this.test_("video.getChannel", video.getChannel())
      this.test_("video.getYoutubeStatus", video.getYoutubeStatus())
      this.test_("video.getWikiHyperlink", video.getWikiHyperlink())
      this.test_("video.getWikiStatus", video.getWikiStatus())
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
        "pass": "PASS",
        "fail": "FAIL"
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
      console.log(`${testResult}: ${logMessage}\n`, actualValue)
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
  settings().setAuthToken(ScriptProperties)
  tests_().testAll()
  tests_().logResult()
}
