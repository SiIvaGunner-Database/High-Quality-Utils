let Playlist

/**
 * Model class representing a playlist.
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
      super(youtubeObject, databaseObject, playlists())
    }

    /**
     * Get the parent spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      return spreadsheets().getById(this.getDatabaseObject().productionSpreadsheet)
    }

    /**
     * Get the parent channel object.
     * @return {Channel} The channel object.
     */
    getChannel() {
      return channels().getById(this.getDatabaseObject().channel)
    }

    /**
     * Get the appropriate metadata from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Integer} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getVideos(limit) {
      return youtube().getPlaylistItems(limit)
    }

    /**
     * Add a video to a YouTube playlist.
     * @param {String} videoId - The video ID.
     */
    addVideo(videoId) {
      YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet")
    }

    /**
     * Remove a video from a YouTube playlist.
     * @param {String} playlistId - The playlist ID.
     * @param {String} videoId - The video ID.
     */
    removeVideo(videoId) {
      const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, videoId: videoId})
      const deletionId = playlist.items[0].id
      YouTube.PlaylistItems.remove(deletionId)
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
          throw `Unexpected response code: ${responseCode}`
      }
    }
  }

  return Playlist
}
