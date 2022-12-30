let Playlist

/**
 * Model class representing a playlist.
 * @extends CommonModel
 * @return {Class} The model class.
 */
function Playlist_() {
  if (Playlist === undefined) Playlist = class Playlist extends CommonModel_() {
    /**
     * Create a playlist object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      const columnConfig = {
        sortColumn: 5,
        columns: {
          1: "id",
          2: "title",
          3: "channelTitle",
          4: "itemCount",
          5: "itemChannels",
          6: "itemIds",
          7: "playlistStatus",
          8: "logDate",
        }
      }
      super(youtubeObject, databaseObject, playlists(), columnConfig)
    }

    /**
     * Get the parent spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      const spreadsheetKey = (settings().isDevModeEnabled() ? "productionSpreadsheet" : "developmentSpreadsheet")
      return spreadsheets().getById(this.getDatabaseObject()[spreadsheetKey])
    }

    /**
     * Get the parent channel object.
     * @return {Channel} The channel object.
     */
    getChannel() {
      return channels().getById(this.getDatabaseObject().channel)
    }

    /**
     * Get all videos in the playlist.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [nextPageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Video], String|null]} An array containing the videos and next page token.
     */
    getVideos(limit, nextPageToken) {
      return videos().getByPlaylistId(super.getId(), limit, nextPageToken)
    }

    /**
     * Add a video to the YouTube playlist.
     * @param {String} videoId - The video ID.
     */
    addVideo(videoId) {
      youtube().addToPlaylist(super.getId(), videoId)
    }

    /**
     * Remove a video from the YouTube playlist.
     * @param {String} videoId - The video ID.
     */
    removeVideo(videoId) {
      youtube().removeFromPlaylist(super.getId(), videoId)
    }

    /**
     * Get the status of the YouTube playlist.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/playlist?list=${super.getId()}&format=json`
      const options = { muteHttpExceptions: true }
      const responseCode = UrlFetchApp.fetch(url, options).getResponseCode()

      switch(responseCode) {
        case 200:
          // TODO differentiate between public and unlisted
          return statuses.public
        case 403:
          return statuses.private
        case 404:
          return statuses.deleted
        default:
          throw new (InvalidResponseError_())(responseCode)
      }
    }
  }

  return Playlist
}
