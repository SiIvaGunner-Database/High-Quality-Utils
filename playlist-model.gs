/**
 * Model class for YouTube playlists.
 */
class Playlist {

  /**
   * Creates a playlist object.
   *
   * @param {String} id The playlist ID.
   * @param {String} title The playlist title.
   * @param {String} contributor The playlist contributor.
   * @param {String} channelId The channel ID.
   * @param {Integer} videoCount The playlist video count.
   * @param {Array[String]} videoIds The playlist video IDs.
   * @param {String} youtubeStatus The playlist status.
   */
  constructor(id, title, contributor, channelId, videoCount, videoIds, youtubeStatus) {
    this.id = id;
    this.title = title;
    this.contributor = contributor;
    this.channelId = channelId;
    this.videoCount = videoCount;
    this.videoIds = videoIds;
    this.youtubeStatus = youtubeStatus;
  }

  /**
   * Gets JSON data from videos in a YouTube playlist.
   *
   * @param {String} playlistId The YouTube playlist ID.
   * @param {Integer} [limit] The video count limit.
   * @returns {Array[Object]} Returns the video objects.
   */
  getPlaylistItems(playlistId, limit) {
    try {
      const itemIds = [];
      let nextPageToken = "";

      while (nextPageToken != null) {
        const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, maxResults: 50, pageToken: nextPageToken});
        playlist.items.forEach(function(item) {itemIds.push(item.snippet.resourceId)});
        nextPageToken = limit && itemIds.length >= limit ? null : playlist.nextPageToken;
      }

      return getVideos(itemIds);
    } catch(e) {
      Logger.log(e);
    }
  }

  /**
   * Adds a video to a YouTube playlist.
   *
   * @param {String} playlistId The YouTube playlist ID.
   * @param {String} videoId The YouTube video ID.
   */
  addToPlaylist(playlistId, videoId) {
    try {
      YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet");
    } catch(e) {
      Logger.log(e);
    }
  }

  /**
   * Removes a video from a YouTube playlist.
   *
   * @param {String} playlistId The YouTube playlist ID.
   * @param {String} videoId The YouTube video ID.
   */
  removeFromPlaylist(playlistId, videoId) {
    try {
      const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, videoId: videoId});
      const deletionId = playlist.items[0].id;
      YouTube.PlaylistItems.remove(deletionId);
    } catch(e) {
      Logger.log(e);
    }
  }

}
