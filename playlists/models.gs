let Playlist

/**
 * Model class representing a playlist.
 * @return {Class} The model class.
 */
function Playlist_() {
  if (Playlist === undefined) Playlist = class Playlist {
    /**
     * Create a playlist object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      this._ytObject = youtubeObject
      this._dbObject = databaseObject
    }

    /**
     * Get the parent spreadsheet object.
     */
    getSpreadsheet() {
      return {}
    }

    /**
     * Get the parent channel object.
     */
    getChannel() {
      return {}
    }

    /**
     * Get the YouTube playlist metadata.
     * See https://developers.google.com/youtube/v3/docs/playlists
     * @return {Object} The playlist metadata.
     */
    getYoutubeObject() {
      return this._ytObject
    }

    /**
     * Get the database playlist metadata.
     * See https://siivagunnerdatabase.net/api/playlists/
     * @return {Object} The playlist metadata.
     */
    getDatabaseObject() {
      return this._dbObject
    }

    getYoutubeStatus() {
      this.getDatabaseObject()
    }

    getChanges() {

    }

    hasChanges() {

    }

    updateDatabaseObject() {

    }

    logChanges_() {

    }

    /**
     * Get the appropriate metadata from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Integer} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getVideos(limit) {
      return youtubeService().getPlaylistItems(limit)
    }

    /**
     * Add a video to a YouTube playlist.
     * @param {String} videoId - The video ID.
     */
    addVideo(videoId) {
      try {
        YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet")
      } catch(e) {
        console.error(e)
      }
    }

    /**
     * Remove a video from a YouTube playlist.
     * @param {String} playlistId - The playlist ID.
     * @param {String} videoId - The video ID.
     */
    removeVideo(videoId) {
      try {
        const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, videoId: videoId})
        const deletionId = playlist.items[0].id
        YouTube.PlaylistItems.remove(deletionId)
      } catch(e) {
        console.error(e)
      }
    }
  }

  return Playlist
}
