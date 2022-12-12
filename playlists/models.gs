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
      // TODO
      return {}
    }

    /**
     * Get the parent channel object.
     * @return {Channel} The channel object.
     */
    getChannel() {
      // TODO
      return {}
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

    /**
     * Get the status of the YouTube playlist.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()
      // TODO fetch YouTube URL
      return statuses.public
    }
  }

  return Playlist
}
