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
        sortColumn: 5,
        columns: {
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
     * Get the associated spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      const spreadsheetKey = (settings().isDevModeEnabled() === true ? "developmentSpreadsheet" : "productionSpreadsheet")
      return spreadsheets().getById(this.getDatabaseObject()[spreadsheetKey])
    }

    /**
     * Get the associated sheet object.
     * @return {WrapperSheet} The sheet object.
     */
    getSheet() {
      return this.getSpreadsheet().getSheet(this.getDatabaseObject().title)
    }

    /**
     * Get all public playlists on the channel.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Playlist], String|null]} An array containing the playlists and next page token.
     */
    getPlaylists(limit, pageToken) {
      return playlists().getByChannelId(super.getId(), limit, pageToken)
    }

    /**
     * Get all public videos on the channel.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Video], String|null]} An array containing the videos and next page token.
     */
    getVideos(limit, pageToken) {
      return videos().getByChannelId(super.getId(), limit, pageToken)
    }

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()

      try {
        youtube().getChannel(super.getId())
        return statuses.public
      } catch (error) {
        console.log(error)
        return statuses.deleted
      }
    }
  }

  return Channel
}
