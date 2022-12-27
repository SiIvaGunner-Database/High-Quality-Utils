let CommonService

/**
 * Common service class for database and caching service operations.
 * Objects must have an ID property for this service to work.
 * @return {Class} The service class.
 */
function CommonService_() {
  if (CommonService === undefined) CommonService = class CommonService {
    /**
     * Create a common service.
     * @param {Class} modelClass - The service's associated model class.
     * @param {String} apiPath - The web application API path.
     */
    constructor(modelClass, apiPath) {
      this._modelClass = modelClass
      this._apiPath = apiPath
      this._cache = []
      this._lastCachedObject = {}
      this._useCache = true
      this._changes
    }

    /**
     * Enable data caching.
     */
    enableCache() {
      this._useCache = true
    }

    /**
     * Disable data caching.
     */
    disableCache() {
      this._useCache = true
    }

    /**
     * Add an object to the cache.
     * @param {Object} object - The object.
     */
    addToCache_(object) {
      if (this._useCache === true) {
        this._lastCachedObject = object
        this._cache.push(object)
      }
    }

    /**
     * Get the cache status of an object by its ID.
     * @param {String} objectId - The object ID.
     * @return {Boolean} True if the object is cached, else false.
     */
    isCached_(objectId) {
      return this._useCache === true && this.getCachedObject_(objectId) !== undefined
    }

    /**
     * Get a cached object by its ID.
     * @param {String} objectId - The object ID.
     * @return {Object} The cached object.
     */
    getCachedObject_(objectId) {
      if (this._lastCachedObject.id === objectId) {
        return this._lastCachedObject
      }

      const cachedObject = this._cache.find(obj => obj.id === objectId)

      if (cachedObject !== undefined) {
        this._lastCachedObject = cachedObject
      }

      return cachedObject
    }

    /**
     * Get the web application API path.
     * @param {String} [objectId] - An optional object ID.
     * @return {String} The API path.
     */
    getApiPath(objectId = "") {
      return `${this._apiPath}/${objectId}`
    }

    /**
     * Get an object by its ID.
     * @param {String} objectId - The object ID.
     * @return {Object} The object.
     */
    getById(objectId) {
      if (this.isCached_(objectId)) {
        return this.getCachedObject_(objectId)
      }

      let baseObject

      switch(this._modelClass) {
        case Channel_():
          baseObject = youtube().getChannel(objectId)
          break
        case Playlist_():
          baseObject = youtube().getPlaylist(objectId)
          break
        case WrapperSpreadsheet_():
          baseObject = SpreadsheetApp.openById(objectId)
          break
        case Video_():
          baseObject = youtube().getVideo(objectId)
          break
        default:
          throw new Error("No model class found for this service")
      }

      const dbObject = database().getData(this.getApiPath(objectId))

      if (baseObject !== undefined && dbObject === undefined) {
        dbObject = {id: baseObject.id}
        database().postData(this.getApiPath(), dbObject)
      }

      const wrapperObject = new (this._modelClass)(baseObject, dbObject)
      super.addToCache_(wrapperObject)
      return wrapperObject
    }

    /**
     * Get all objects.
     * @return {Array[Object]} The objects.
     */
    getAll() {
      return database().getData(this.getApiPath())
    }

    /**
     * Get a list of differences between the base object and the database object.
     * @return {Array[String]} An array of database object keys for any new values.
     */
    getAllChanges() {
      if (this._changes === undefined) {
        /** @type {{ object: this; key: string; value: any; message: string; }[]} */
        this._changes = []

        this.getAll().forEach(object => {
          this._changes.push(...object.getChanges())
        })
      }

      return this._changes
    }

    /**
     * Get whether or not the base object has any differences from the database object.
     * @return {Boolean} True if there are any differences, else false.
     */
    hasAnyChanges() {
      return this.getAllChanges().length > 0
    }

    /**
     * Update all objects.
     * @param {Object} [applyChanges] - Whether or not to apply the update to the database. Defaults to true.
     */
    updateAll(applyChanges = true) {
      const objects = this.getAll()
      let changes = []

      objects.forEach(object => {
        if (object.hasChanges()) {
          object.update(false)
          changes.push(object.getChanges())
        }
      })

      if (applyChanges === true) {
        database().putData(this.getApiPath(), objects)
      }

      this._changes = []
    }
  }

  return CommonService
}

let YoutubeService

/**
 * Service class for YouTube API operations.
 * @return {Class} The service class.
 */
function YoutubeService_() {
  if (YoutubeService === undefined) YoutubeService = class YoutubeService {
    /**
     * Create a YouTube service.
     */
    constructor() {
    }

    /**
     * Get a simple key value object map of possible YouTube statuses.
     * @return {Object} A key value map.
     */
    getStatuses() {
      return {
        public: "Public",
        unlisted: "Unlisted",
        private: "Private",
        unavailable: "Unavailable",
        deleted: "Deleted"
      }
    }

    /**
     * Get formatted metadata from YouTube objects modified to match corresponding database metadata.
     * @param {Array[Object]} data - The YouTube objects.
     * @return {Array[Object]} The formatted objects.
     */
    formatMetadata_(objects) {
      const keysToRemove = ["etag", "snippet", "contentDetails", "statistics"]
      const keysToReplace = [{ oldKey: "channelId", newKey: "channel" }]

      return objects.map(object => {

        // Remove keys that aren't in the database metadata
        keysToRemove.forEach(key => {
          if (object[key] !== undefined) {
            object = { ...object, ...object[key] }
            delete object[key]
          }
        })

        // Replace keys that have different names in the database metadata
        keysToReplace.forEach(keys => {
          if (object[keys.oldKey] !== undefined) {
            object[keys.newKey] = object[keys.oldKey]
            delete object[keys.oldKey]
          }
        })

        return object
      })
    }

    /**
     * Get the metadata from a YouTube channel.
     * @param {String} channelId - The YouTube channel ID.
     * @return {Object} The channel object.
     */
    getChannel(channelId) {
      return this.getChannels([channelId])[0]
    }

    /**
     * Get the metadata from multiple YouTube channels.
     * @param {Array[String]} channelIds - The YouTube channel IDs.
     * @return {Array[Object]} The channel objects.
     */
    getChannels(channelIds) {
      const channels = []
      const arrayOfIds = channelIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        channels.push(...YouTube.Channels.list("snippet,statistics", {id: stringOfIds}).items)
      }

      return this.formatMetadata_(channels)
    }

    /**
     * Get the metadata from a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @return {Object} The playlist object.
     */
    getPlaylist(playlistId) {
      return this.getPlaylists([playlistId])[0]
    }

    /**
     * Get the metadata from multiple YouTube playlists.
     * @param {Array[String]} playlistIds - The YouTube playlist IDs.
     * @return {Array[Object]} The playlist objects.
     */
    getPlaylists(playlistIds) {
      const playlists = []
      const arrayOfIds = playlistIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        playlists.push(...YouTube.Playlists.list("snippet,contentDetails", {id: stringOfIds}).items)
      }

      return this.formatMetadata_(playlists)
    }

    /**
     * Add a video to a YouTube playlist.
     * @param {String} playlistId - The playlist ID.
     * @param {String} videoId - The video ID.
     */
    addToPlaylist(playlistId, videoId) {
      const resource = {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId: videoId
          }
        }
      }
      YouTube.PlaylistItems.insert(resource, "snippet")
    }

    /**
     * Remove a video from a YouTube playlist.
     * @param {String} playlistId - The playlist ID.
     * @param {String} videoId - The video ID.
     */
    removeFromPlaylist(playlistId, videoId) {
      const parameters = {
        playlistId: playlistId,
        videoId: videoId
      }
      const playlist = YouTube.PlaylistItems.list("snippet", parameters)
      const deletionId = playlist.items[0].id
      YouTube.PlaylistItems.remove(deletionId)
    }

    /**
     * Get the metadata from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Number} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getPlaylistItems(playlistId, limit) {
      const itemIds = []
      let nextPageToken = ""

      while (nextPageToken !== null) {
        const parameters = {
          playlistId: playlistId,
          maxResults: 50,
          pageToken: nextPageToken
        }
        const playlist = YouTube.PlaylistItems.list("snippet", parameters)
        itemIds.push(...playlist.items.map(item => item.snippet.resourceId.videoId))

        if (limit !== undefined && itemIds.length >= limit) {
          nextPageToken = null
        } else {
          nextPageToken = playlist.nextPageToken
        }
      }

      return this.getVideos(itemIds)
    }

    /**
     * Get the metadata from a YouTube video.
     * @param {String} videoId - The YouTube video ID.
     * @return {Object} The video object.
     */
    getVideo(videoId) {
      return this.getVideos([videoId])[0]
    }

    /**
     * Get the metadata from multiple YouTube videos.
     * @param {Array[String]} videoIds - The YouTube video IDs.
     * @return {Array[Object]} The video objects.
     */
    getVideos(videoIds) {
      const videos = []
      const arrayOfIds = videoIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        console.log(stringOfIds)
        videos.push(...YouTube.Videos.list("snippet,contentDetails,statistics", {id: stringOfIds}).items)

        if (videos.length % 1000 < 50 && videos.length > 50) {
          console.log(`Found ${videos.length} videos...`)
        }
      }

      return this.formatMetadata_(videos)
    }
  }

  return YoutubeService
}

let theYoutubeService

/**
 * Get the YouTube service.
 * return {YoutubeService} The service object.
 */
function youtube() {
  if (theYoutubeService === undefined) {
    theYoutubeService = new (YoutubeService_())()
  }

  return theYoutubeService
}

let DatabaseService

/**
 * Service class for siivagunnerdatabase.net API operations.
 * @return {Class} The service class.
 */
function DatabaseService_() {
  if (DatabaseService === undefined) DatabaseService = class DatabaseService {
    /**
     * Create a database service.
     */
    constructor() {
    }

    /**
     * Get the web application development/production domain.
     * @return {String} The web application domain, usually "siivagunnerdatabase.net".
     */
    getDomain() {
      if (settings().isDevMode()) {
        return "dev.siivagunnerdatabase.net"
      } else {
        return "siivagunnerdatabase.net"
      }
    }

    /**
     * Get metadata from the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @return {Object} The response object.
     */
    getData(apiPath) {
      return this.fetchResponse_(apiPath, "GET")
    }

    /**
     * Post metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response object.
     */
    postData(apiPath, data) {
      return this.fetchResponse_(apiPath, "POST", data)
    }

    /**
     * Put metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response object.
     */
    putData(apiPath, data) {
      return this.fetchResponse_(apiPath, "PUT", data)
    }

    /**
     * Delete metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response object.
     */
    deleteData(apiPath, data) {
      return this.fetchResponse_(apiPath, "DELETE", data)
    }

    /**
     * Get metadata from the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - An optional path to append to "siivagunnerdatabase.net/api/".
     * @param {String} [method] - An optional method to use. Defaults to "GET".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response object.
     */
    fetchResponse_(apiPath = "", method = "GET", data = {}) {
      const url = `https://${this.getDomain()}/api/${apiPath}`
      const options = {
        method: method,
        contentType: "application/json",
        headers: { Authorization: settings().getAuthToken() },
        payload: JSON.stringify(data)
      }
      const response = UrlFetchApp.fetch(url, options)
      return JSON.parse(response.getContentText())
    }
  }

  return DatabaseService
}

let theDatabaseService

/**
 * Get the database service.
 * return {DatabaseService} The service object.
 */
function database() {
  if (theDatabaseService === undefined) {
    theDatabaseService = new (DatabaseService_())()
  }

  return theDatabaseService
}
