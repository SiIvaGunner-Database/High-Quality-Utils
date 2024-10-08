let Channel

/**
 * Model class representing a channel.
 * @extends CommonModel
 * @return {Class} The model class.
 */
function Channel_() {
  if (Channel === undefined) Channel = class Channel extends CommonModel_() {
    /**
     * Create a channel object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      const columnConfig = {
        "sortColumn": 5,
        "columns": {
          1: "id",
          2: "title",
          3: "wiki",
          4: "channelStatus",
          5: "publishedAt",
          6: "description",
          7: "videoCount",
          8: "subscriberCount",
          9: "viewCount"
        }
      }
      super(youtubeObject, databaseObject, channels(), columnConfig)
    }

    /**
     * Check whether or not the channel has a dedicated video sheet.
     * @return {Boolean} True if the sheet exists, else false.
     */
    hasSheet() {
      const spreadsheetKey = (settings().isDevModeEnabled() === true ? "developmentSpreadsheet" : "productionSpreadsheet")
      const spreadsheetId = super.getDatabaseObject()[spreadsheetKey]
      return spreadsheetId !== undefined && spreadsheetId !== null
        && this.getSpreadsheet().hasSheet(super.getDatabaseObject().title) === true
    }

    /**
     * Get the associated videos spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      const spreadsheetKey = (settings().isDevModeEnabled() === true ? "developmentSpreadsheet" : "productionSpreadsheet")
      return spreadsheets().getById(super.getDatabaseObject()[spreadsheetKey])
    }

    /**
     * Get the associated videos sheet object.
     * @return {WrapperSheet} The sheet object.
     */
    getSheet() {
      return this.getSpreadsheet().getSheet(super.getDatabaseObject().title)
    }

    /**
     * Get the associated changelog spreadsheet object.
     * @return {WrapperSpreadsheet} The sheet object.
     */
    getChangelogSpreadsheet() {
      const spreadsheetKey = (settings().isDevModeEnabled() === true ? "developmentChangelogSpreadsheet" : "productionChangelogSpreadsheet")
      return spreadsheets().getById(super.getDatabaseObject()[spreadsheetKey])
    }

    /**
     * Get all public playlists on the channel.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Playlist], String|undefined]} An array containing the playlists and next page token.
     */
    getPlaylists(limit, pageToken) {
      return playlists().getByChannelId(super.getId(), limit, pageToken)
    }

    /**
     * Get the associated undocumented rips playlist, if it exists.
     * @return {Playlist} The playlist object.
     */
    getUndocumentedRipsPlaylist() {
      const playlistKey = (settings().isDevModeEnabled() === true ? "developmentUndocumentedRipsPlaylist" : "productionUndocumentedRipsPlaylist")
      return playlists().getById(super.getDatabaseObject()[playlistKey])
    }

    /**
     * Get all public videos on the channel.
     * @param {Object} [options] - An optional object of options to include: { parameters: Object; limit: Number; pageToken: String; }
     * @return {Array[Array[Video], String|undefined]} An array containing the videos and next page token.
     */
    getVideos(options) {
      return videos().getByChannelId(super.getId(), options)
    }

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()

      if (settings().isYoutubeApiEnabled() === false) {
        return super.getDatabaseObject().youtubeStatus
      } else if (super.getOriginalObject() === undefined) {
        return statuses.deleted
      } else {
        return statuses.public
      }
    }

    /**
     * Get a hyperlink to the channel's associated spreadsheet.
     * @return {String} The hyperlink formula.
     */
    getSpreadsheetHyperlink() {
      const dbObject = super.getDatabaseObject()
      const spreadsheetId = (settings().isDevModeEnabled() === true ? dbObject.developmentSpreadsheet : dbObject.productionSpreadsheet)
      return utils().formatHyperlink(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, spreadsheetId)
    }

    /**
     * Get a hyperlink to the channel's associated wiki.
     * @return {String} The hyperlink formula.
     */
    getWikiHyperlink() {
      const wiki = super.getDatabaseObject().wiki
      return utils().formatHyperlink(`https://${wiki}.fandom.com/wiki/`, wiki)
    }
  }

  return Channel
}
