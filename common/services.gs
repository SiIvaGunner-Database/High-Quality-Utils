let CachedService

/**
 * Common service class for cached operations.
 * @return {Class} The service class.
 */
function CachedService_() {
  if (CachedService == undefined) CachedService = class CachedService {
    /**
     * Create a cache service.
     */
    constructor() {
      this._cache = []
      this._useCache = true
    }

    isCached(objectId) {
      return false
    }

    getFromCache(objectId) {
      return {}
    }

    enableCache() {
      this._useCache = true
    }

    disableCache() {
      this._useCache = true
    }
  }

  return CachedService
}

let YoutubeService

/**
 * Service class for YouTube API operations.
 * @extends CachedService
 * @return {Class} The service class.
 */
function YoutubeService_() {
  if (YoutubeService == undefined) YoutubeService = class YoutubeService extends CachedService_() {
    /**
     * Create a YouTube service.
     */
    constructor() {
      super()
    }

    /**
     * Get the appropriate metadata from multiple YouTube channels.
     * @param {Array[String]} channelIds - The YouTube channel IDs.
     * @return {Object} The channel objects.
     */
    getChannels(channelIds) {
      try {
        const channels = []
        const arrayOfIds = channelIds.slice()
        let stringOfIds = ""

        while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
          YouTube.Channels.list("snippet,statistics", {id: stringOfIds}).items.forEach((item) => {
            channels.push(new Channel(
              item.id,
              item.snippet.title,
              "None",
              "Public",
              formatDate(item.snippet.publishedAt),
              item.snippet.description,
              item.statistics.videoCount,
              item.statistics.subscriberCount,
              item.statistics.viewCount
            ))
          })
        }

        return channels
      } catch(e) {
        Logger.log(e)
      }
    }

    /**
     * Get the appropriate metadata from multiple YouTube playlists.
     * @param {Array[String]} playlistIds - The YouTube playlist IDs.
     * @return {Object} The playlist objects.
     */
    getPlaylists(playlistIds) {
      try {
        const playlists = []
        const arrayOfIds = playlistIds.slice()
        let stringOfIds = ""

        while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
          YouTube.Playlists.list("snippet,contentDetails", {id: stringOfIds}).items.forEach((item) => {
            playlists.push(new Playlist(
              item.id,
              item.snippet.title,
              "",
              item.snippet.description,
              item.contentDetails.itemCount,
              "",
              "Public"
            ))
          })
        }

        return playlists
      } catch(e) {
        Logger.log(e)
      }
    }

    /**
     * Add a video to a YouTube playlist.
     * @param {String} playlistId - The playlist ID.
     * @param {String} videoId - The video ID.
     */
    addToPlaylist(playlistId, videoId) {
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
    removeFromPlaylist(playlistId, videoId) {
      try {
        const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, videoId: videoId})
        const deletionId = playlist.items[0].id
        YouTube.PlaylistItems.remove(deletionId)
      } catch(e) {
        Logger.log(e)
      }
    }

    /**
     * Get the appropriate metadata from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Integer} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getPlaylistItems(limit) {
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
     * Get the appropiate metadata from multiple YouTube videos.
     * @param {Array[String]} videoIds - The YouTube video IDs.
     * @return {Array[Object]} The video objects.
     */
    getVideos(videoIds) {
      const videos = []
      const arrayOfIds = videoIds.slice()
      let stringOfIds = ""

      try {
        while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
          YouTube.Videos.list("snippet,contentDetails,statistics", {id: stringOfIds}).items.forEach((item) => {
            videos.push(new Video(
              item.id,
              item.snippet.title,
              "Undocumented",
              "Public",
              formatDate(item.snippet.publishedAt),
              item.contentDetails.duration,
              item.snippet.description,
              item.statistics.viewCount,
              item.statistics.likeCount,
              item.statistics.dislikeCount,
              item.statistics.commentCount
            ))
          })

          if (videos.length % 1000 < 50 && videos.length > 50) {
            Logger.log("Found " + videos.length + " videos...")
          }
        }
      } catch(e) {
        Logger.log(e)
      }

      return videos
    }
  }

  return YoutubeService
}

let DatabaseService

/**
 * Service class for siivagunnerdatabase.net API operations.
 * @extends CachedService
 * @return {Class} The service class.
 */
function DatabaseService_() {
  if (DatabaseService == undefined) DatabaseService = class DatabaseService extends CachedService_() {
    /**
     * Create a database service.
     */
    constructor() {
      super()
    }

    getFromDatabase(objectClass, objectId) {

    }

    putToDatabase(objects) {

    }

    postToDatabase(objects) {

    }

    /**
     * Get the appropiate metadata from the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/"".
     * @param {String} [method] - The method to use, defaults to "GET".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response object.
     */
    getDatabaseResponse(apiPath, method, data) {
      if (data) {
        // Convert to Array[]
        if (!Array.isArray(data)) {
          data = [data]
        }

        // Set any required fields
        if (apiPath == "rips") {
          const channelId = YouTube.Videos.list("snippet", { id: data[0].id }).items[0].snippet.channelId

          data.forEach((video, index) => {
            video.channel = channelId
            video.author = 2 // spreadsheet-bot
            video.visible = true
            data[index] = video
          })
        } else if (apiPath == "channels") {
          data.forEach((channel, index) => {
            channel.author = 2 // spreadsheet-bot
            channel.visible = true
            data[index] = channel
          })
        }
      }

      const url = "https://siivagunnerdatabase.net/api/" + apiPath || ""
      const options = {
        method: method || "GET",
        contentType: "application/json",
        headers: { Authorization: getAuthToken() },
        payload: JSON.stringify(data || {})
      }
      const response = UrlFetchApp.fetch(url, options)
      return JSON.parse(response.getContentText())
    }
  }

  return DatabaseService
}
