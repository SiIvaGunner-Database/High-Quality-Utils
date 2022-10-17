/**
 * Model class representing a playlist.
 */
class Playlist {

  /**
   * Creates a playlist object.
   * @param {Object} youtubeObject - The YouTube metadata object.
   * @param {Object} databaseObject - The database metadata object.
   */
  constructor(youtubeObject, databaseObject) {
    this._ytObject = youtubeObject
    this._dbObject = databaseObject
  }

  /**
   * The parent spreadsheet object.
   */
  getSpreadsheet() {
    
  }

  /**
   * The parent channel object.
   */
  getChannel() {
    
  }

  /**
   * Get the YouTube playlist metadata object.
   * See https://developers.google.com/youtube/v3/docs/playlists
   * @return {Object} the playlist metadata
   */
  getYoutubeObject() {
    return {}
  }

  /**
   * Get the database playlist metadata object.
   * See https://siivagunnerdatabase.net/api/playlists/
   * @return {Object} the playlist metadata
   */
  getDatabaseObject() {
    return {}
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
   * Gets JSON data from videos in a YouTube playlist.
   * @param {String} playlistId - The YouTube playlist ID.
   * @param {Integer} [limit] - The video count limit.
   * @return {Array[Object]} The video objects.
   */
  getVideos(limit) {
    try {
      const itemIds = []
      let nextPageToken = ""

      while (nextPageToken != null) {
        const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, maxResults: 50, pageToken: nextPageToken})
        playlist.items.forEach(function(item) {itemIds.push(item.snippet.resourceId)})
        nextPageToken = limit && itemIds.length >= limit ? null : playlist.nextPageToken
      }

      return getVideos(itemIds)
    } catch(e) {
      Logger.log(e)
    }
  }

  /**
   * Add a video to a YouTube playlist.
   * @param {String} playlistId - The playlist ID.
   * @param {String} videoId - The video ID.
   */
  addVideo(videoId) {
    try {
      YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet")
    } catch(e) {
      Logger.log(e)
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
      Logger.log(e)
    }
  }

}
