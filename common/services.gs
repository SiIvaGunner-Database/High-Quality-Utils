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
      this._cache = new Map()
      this._isCacheEnabled = true
    }

    /**
     * Enable data caching.
     * Caching is enabled by default.
     */
    enableCache() {
      this._isCacheEnabled = true
    }

    /**
     * Disable data caching.
     */
    disableCache() {
      this._isCacheEnabled = true
    }

    /**
     * Add a common model object to the cache.
     * @param {CommonModel} object - The object to cache.
     */
    addToCache_(object) {
      if (this._isCacheEnabled === true) {
        this._cache.set(object.getId(), object)
      }
    }

    /**
     * Get the cache status of an object by its ID.
     * @param {String} objectId - The object ID.
     * @return {Boolean} True if the object is cached, else false.
     */
    isCached_(objectId) {
      return (this._isCacheEnabled === true && this.getCachedObject_(objectId) !== undefined)
    }

    /**
     * Get a cached common model object by its ID.
     * @param {String} objectId - The object ID.
     * @return {CommonModel} The cached model object.
     */
    getCachedObject_(objectId) {
      return this._cache.get(objectId)
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
     * Get a common model object by its ID.
     * @param {String} objectId - The object ID.
     * @return {CommonModel} The model object.
     */
    getById(objectId) {
      if (!objectId) {
        return undefined
      } else if (this.isCached_(objectId)) {
        return this.getCachedObject_(objectId)
      }

      let dbObject

      try {
        if (this._modelClass !== WrapperSpreadsheet_()) {
          dbObject = database().getData(this.getApiPath(objectId))
        }
      } catch (error) {
        console.warn("No database object found\n", error.stack)
      }

      let originalObject

      switch (this._modelClass) {
        case Channel_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObject = youtube().getChannel(objectId)
          }
          break
        case Playlist_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObject = youtube().getPlaylist(objectId)
          }
          break
        case WrapperSpreadsheet_():
          originalObject = SpreadsheetApp.openById(objectId)
          break
        case Video_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObject = youtube().getVideo(objectId)
          }
          break
      }

      if (originalObject === undefined && dbObject === undefined) {
        console.warn(`No data found for object with ID "${objectId}"`)
        return undefined
      }

      return new (this._modelClass)(originalObject, dbObject)
    }

    /**
     * Get common model objects by their IDs.
     * @param {Array[String]} objectIds - The object IDs.
     * @return {Array[CommonModel]} The model objects.
     */
    getByIds(objectIds) {
      // TODO - test and update to the following:
      // return this.getAll({ "id__in": objectIds.join(",") })
      return objectIds.map(objectId => this.getById(objectId))
    }

    /**
     * Get common model objects filtered by given parameters.
     * @param {Object} [databaseParameters] - An optional key-value object map to filter database results.
     * @param {Array[Object]} [originalObjects] - An optional list of original object metadata to include in the returned objects.
     * @param {Number} [limit] - An optional result count limit.
     * @return {Array[CommonModel]} The model objects.
     */
    getByFilter(databaseParameters, originalObjects, limit) {
      if (originalObjects !== undefined && originalObjects.length === 0) {
        return []
      }

      const dbObjects = database().getData(this.getApiPath(), databaseParameters, limit).results

      if (originalObjects !== undefined) {
        const dbObjectMap = new Map(dbObjects.map(dbObject => [dbObject.id, dbObject]))
        return originalObjects.map(ogObject => new (this._modelClass)(ogObject, dbObjectMap.get(ogObject.id)))
      } else {
        return dbObjects.map(dbObject => new (this._modelClass)(undefined, dbObject))
      }
    }

    /**
     * Get all common model objects in the web application database.
     * @param {Object} [databaseParameters] - An optional key-value object map to filter database results.
     * @param {Number} [limit] - An optional result count limit.
     * @return {Array[CommonModel]} The model objects.
     */
    getAll(databaseParameters = {}, limit) {
      const parameters = {
        "visible": true,
        ...databaseParameters
      }
      const dbObjects = database().getData(this.getApiPath(), parameters, limit).results
      const dbObjectIds = dbObjects.map(dbObject => dbObject.id)
      let originalObjects = []

      switch (this._modelClass) {
        case Channel_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObjects = youtube().getChannels(dbObjectIds)
          }
          break
        case Playlist_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObjects = youtube().getPlaylists(dbObjectIds)
          }
          break
        case WrapperSpreadsheet_():
          originalObjects = dbObjectIds.map(spreadsheetId => {
            const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
            spreadsheet.id = spreadsheet.getId()
            return spreadsheet
          })
          break
        case Video_():
          if (settings().isYoutubeApiEnabled() === true) {
            originalObjects = youtube().getVideos(dbObjectIds)
          }
          break
      }

      const originalObjectMap = new Map(originalObjects.map(originalObject => [originalObject.id, originalObject]))
      return dbObjects.map(dbObject => new (this._modelClass)(originalObjectMap.get(dbObject.id), dbObject))
    }

    /**
     * Update a list of common model objects.
     * @param {Array[CommonModel]} objects - The objects to update.
     * @param {Boolean} [applyChanges] - Whether or not to apply the update to the database. Defaults to true.
     */
    updateAll(objects, applyChanges = true) {
      const dbObjects = []

      objects.forEach(object => {
        if (object.getDatabaseObject() === undefined) {
          console.warn(`Object with ID "${object.getId()}" hasn't been created yet`)
          return
        }

        if (object.hasChanges() === true) {
          object.update(false)
        }

        dbObjects.push(object.getDatabaseObject())
      })

      if (applyChanges === true && dbObjects.length > 0) {
        database().putData(this.getApiPath(), dbObjects)
      }
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
        "public": "Public",
        "unlisted": "Unlisted",
        "private": "Private",
        "unavailable": "Unavailable",
        "deleted": "Deleted"
      }
    }

    /**
     * Get formatted metadata from YouTube objects modified to match corresponding database metadata.
     * TODO: Rethink the use of this function. It's unintuitive and confusing right now.
     * @param {Array[Object]} data - The YouTube metadata.
     * @return {Array[Object]} The formatted metadata.
     */
    formatMetadata_(objects) {
      const keysToRemove = ["etag", "kind", "channel"]
      const keysToMerge = ["snippet", "contentDetails", "statistics", ["brandingSettings", "image"]]
      const keysToReplace = [{ "oldKey": "channelId", "newKey": "channel" }]

      return objects.map(object => {
        // Remove keys that aren't in the database metadata
        keysToRemove.forEach(key => {
          if (object[key] !== undefined) {
            delete object[key]
          }
        })

        // Merge properties for unwanted keys with parent properties
        // For example, "object.snippet.title" becomes "object.title"
        keysToMerge.forEach(key => {
          if (object[key] !== undefined) {
            object = { ...object, ...object[key] }
            delete object[key]
          } else if (Array.isArray(key) === true && object[key[0]] !== undefined && object[key[0]][key[1]] !== undefined) {
            object = { ...object, ...object[key[0]][key[1]] }
            delete object[key[0]]
          }
        })

        // Replace keys that have different names in the database metadata
        keysToReplace.forEach(keys => {
          if (object[keys.oldKey] !== undefined) {
            object[keys.newKey] = object[keys.oldKey]
            delete object[keys.oldKey]
          }
        })

        // Convert additional keys into valid values for the database
        Object.entries(object).forEach(([key, value]) => {
          if (typeof value === "object") {
            // Convert sub-objects into sorted string representations of themselves
            object[key] = utils().stringifySortedObject(value)
          } else if (typeof value === "string" && value !== "" && Number.isInteger(Number(value)) === true) {
            // Convert numerical strings into numbers
            object[key] = Number(value)
          } else if (typeof value === "string") {
            // Remove spaces, new lines, etc. from the start and end of strings
            object[key] = value.trim()
          }
        })

        return object
      })
    }

    /**
     * Get a the first channel ID returned from a search queried for the given search terms. Should be used with caution.
     * @param {String} searchTerms - Search terms such as "https://www.youtube.com/@name" or "Channel Name".
     * @return {String} The channel ID.
     */
    getChannelId(searchTerms) {
      const options = {
        q: searchTerms,
        type: "channel",
        maxResults: "1" 
      }
      const channelResults = YouTube.Search.list("snippet", options)

      if (channelResults.items.length === 0) {
        throw new Error(`No channel found with the name "${searchTerms}"`)
      }

      return channelResults.items[0].id.channelId
    }

    /**
     * Get the metadata from a YouTube channel.
     * @param {String} channelId - The YouTube channel ID.
     * @return {Object} The channel metadata.
     */
    getChannel(channelId) {
      return this.getChannels([channelId])[0]
    }

    /**
     * Get the metadata from multiple YouTube channels.
     * @param {Array[String]} channelIds - The YouTube channel IDs.
     * @return {Array[Object]} The channel metadata.
     */
    getChannels(channelIds) {
      const channels = []
      const arrayOfIds = channelIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        channels.push(...YouTube.Channels.list("snippet,statistics,brandingSettings", { "id": stringOfIds }).items)
      }

      return this.formatMetadata_(channels)
    }

    /**
     * Get the metadata from public playlists on a YouTube channel.
     * @param {String} channelId - The YouTube channel ID.
     * @param {Number} [limit] - An optional playlist count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Object], String|undefined]} An array containing the metadata and next page token.
     */
    getChannelPlaylists(channelId, limit, pageToken = "") {
      const playlists = []

      while (pageToken !== undefined) {
        const parameters = {
          "channelId": channelId,
          "maxResults": 50,
          "pageToken": pageToken
        }
        const playlist = YouTube.Playlists.list("snippet,contentDetails", parameters)
        playlists.push(...playlist.items)
        pageToken = playlist.nextPageToken

        if (limit !== undefined && playlists.length >= limit) {
          break
        }
      }

      return [playlists, pageToken]
    }

    /**
     * Get the metadata from public uploads on a YouTube channel.
     * @param {String} channelId - The YouTube channel ID.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Object], String|undefined]} An array containing the metadata and next page token.
     */
    getChannelVideos(channelId, limit, pageToken) {
      try {
        const channel = YouTube.Channels.list("contentDetails", { "id": channelId }).items[0]
        const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads
        return youtube().getPlaylistVideos(uploadsPlaylistId, limit, pageToken)
      } catch (error) {
        console.warn(`No channel videos found for ID ${channelId}\n`, error.stack)
        return [[], undefined]
      }
    }

    /**
     * Create a YouTube playlist and return the metadata.
     * @param {Object} snippet - The snippet metadata, e.g. "{ title: 'title' }".
     * @param {String} [privacyStatus] - The playlist privacy status, defaulting to "public".
     * @return {Object} The newly created playlist metadata.
     */
    createPlaylist(snippet, privacyStatus = "public") {
      const options = {
        "snippet": snippet,
        "status": {
          "privacyStatus": privacyStatus
        }
      }
      return YouTube.Playlists.insert(options, "snippet,status")
    }

    /**
     * Update a YouTube playlist and return the metadata.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Object} snippet - The snippet metadata, e.g. "{ title: 'title' }".
     * @param {String} [privacyStatus] - The playlist privacy status, defaulting to the existing playlist status.
     * @return {Object} The updated playlist metadata.
     */
    updatePlaylist(playlistId, snippet, privacyStatus) {
      const options = {
        "id": playlistId,
        "snippet": snippet
      }
      let part = "snippet"

      if (privacyStatus !== undefined) {
        options.status = { "privacyStatus": privacyStatus }
        part += ",status"
      }

      return YouTube.Playlists.update(options, part)
    }

    /**
     * Get the metadata from a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @return {Object} The playlist metadata.
     */
    getPlaylist(playlistId) {
      return this.getPlaylists([playlistId])[0]
    }

    /**
     * Get the metadata from multiple YouTube playlists.
     * @param {Array[String]} playlistIds - The YouTube playlist IDs.
     * @return {Array[Object]} The playlist metadata.
     */
    getPlaylists(playlistIds) {
      const playlists = []
      const arrayOfIds = playlistIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        playlists.push(...YouTube.Playlists.list("snippet,contentDetails", { "id": stringOfIds }).items)
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
        "snippet": {
          "playlistId": playlistId,
          "resourceId": {
            "kind": "youtube#video",
            "videoId": videoId
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
        "playlistId": playlistId,
        "videoId": videoId
      }
      let playlist

      try {
        playlist = YouTube.PlaylistItems.list("snippet", parameters)
      } catch (error) {
        console.warn(`Failed to fetch video with ID "${videoId}" from playlist with ID "${playlistId}"\n`, error.stack)
        return
      }

      const itemToDelete = playlist.items[0]
      if (itemToDelete !== undefined) {
        YouTube.PlaylistItems.remove(itemToDelete.id)
      } else {
        console.warn(`Video with ID "${videoId}" not found in playlist with ID "${playlistId}"`)
      }
    }

    /**
     * Get the metadata from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Object], String|undefined]} An array containing the metadata and next page token.
     */
    getPlaylistVideos(playlistId, limit, pageToken = "") {
      const videoIds = this.getPlaylistVideoIds(playlistId, limit, pageToken)
      return [this.getVideos(videoIds), pageToken]
    }

    /**
     * Get an array of IDs from videos in a YouTube playlist.
     * @param {String} playlistId - The YouTube playlist ID.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[String]} An array of video IDs.
     */
    getPlaylistVideoIds(playlistId, limit, pageToken = "") {
      const itemIds = []

      while (pageToken !== undefined) {
        const parameters = {
          "playlistId": playlistId,
          "maxResults": 50,
          "pageToken": pageToken
        }
        const playlist = YouTube.PlaylistItems.list("snippet", parameters)
        itemIds.push(...playlist.items.map(item => item.snippet.resourceId.videoId))
        pageToken = playlist.nextPageToken

        if (limit !== undefined && itemIds.length >= limit) {
          break
        }
      }

      return itemIds
    }

    /**
     * Get the metadata from a YouTube video.
     * @param {String} videoId - The YouTube video ID.
     * @return {Object} The video metadata.
     */
    getVideo(videoId) {
      return this.getVideos([videoId])[0]
    }

    /**
     * Get the metadata from multiple YouTube videos.
     * @param {Array[String]} videoIds - The YouTube video IDs.
     * @return {Array[Object]} The video metadata.
     */
    getVideos(videoIds) {
      const videos = []
      const arrayOfIds = videoIds.slice()
      let stringOfIds = ""

      while ((stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds !== undefined) {
        videos.push(...YouTube.Videos.list("snippet,contentDetails,statistics", { "id": stringOfIds }).items)
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
      this._GET = "GET"
      this._POST = "POST"
      this._PUT = "PUT"
      this._DELETE = "DELETE"
    }

    /**
     * Get the web application development/production domain.
     * @return {String} The web application domain, usually "siivagunnerdatabase.net".
     */
    getDomain() {
      if (settings().isDevModeEnabled()) {
        return "dev.siivagunnerdatabase.net"
      } else {
        return "siivagunnerdatabase.net"
      }
    }

    /**
     * Get metadata from the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object} [parameters] - An optional parameter map to append to the URL. E.g. "{'id': 0}" becomes "?id=0".
     * @param {Number} [limit] - An optional result count limit.
     * @return {Object} The response metadata.
     */
    getData(apiPath, parameters, limit) {
      return this.fetchResponse_(apiPath, this._GET, parameters, limit)
    }

    /**
     * Post metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response metadata.
     */
    postData(apiPath, data) {
      return this.fetchResponse_(apiPath, this._POST, data)
    }

    /**
     * Put metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response metadata.
     */
    putData(apiPath, data) {
      return this.fetchResponse_(apiPath, this._PUT, data)
    }

    /**
     * Delete metadata to the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - The path to append to "siivagunnerdatabase.net/api/".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @return {Object} The response metadata.
     */
    deleteData(apiPath, data) {
      return this.fetchResponse_(apiPath, this._DELETE, data)
    }

    /**
     * Get metadata from the siivagunnerdatabase.net API.
     * This will fail if the user doesn't have permission.
     * @param {String} [apiPath] - An optional path to append to "siivagunnerdatabase.net/api/".
     * @param {String} [method] - An optional method to use. Defaults to "GET".
     * @param {Object | Array[Object]} [data] - The metadata to send.
     * @param {Number} [limit] - An optional result count limit. This currently only works in increments of 1000.
     * @return {Object} The response metadata.
     */
    fetchResponse_(apiPath = "", method = this._GET, data, limit) {
      const options = {
        "method": method,
        "contentType": "application/json",
        "headers": { "Authorization": settings().getAuthToken() },
      }

      let parameters = ""

      if (data !== undefined) {
        if (method === this._GET) {
          parameters = "?" + Object.entries(data).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join("&")
        } else {
          options.payload = JSON.stringify(data)
        }
      }

      let url = `https://${this.getDomain()}/api/${apiPath}${parameters}`
      let responseJSON = {}
      let responseResults = []

      try {
        do {
          if (responseJSON.next !== undefined && responseJSON.next !== null) {
            url = responseJSON.next
          }

          console.log("Method:", method, "\nURL:", url, "\nPayload:", options.payload)
          const requestStartTime = new Date().getTime()
          const responseObject = UrlFetchApp.fetch(url, options)
          responseJSON = JSON.parse(responseObject.getContentText())
          const requestCompletionTime = new Date().getTime() - requestStartTime
          console.log(`Request completed in ${requestCompletionTime} milliseconds`)

          if (responseJSON.results !== undefined && responseJSON.results !== null) {
            responseResults.push(...responseJSON.results)
          }

          // Continue while a next page exists and the result count hasn't passed the limit
        } while (
          method === this._GET
          && responseJSON.next !== undefined
          && responseJSON.next !== null
          && (limit === undefined || responseResults.length < limit)
        )
      } catch (error) {
        throw new Error(`${url}\n${error.message}`)
      }

      if (responseJSON.results !== undefined && responseJSON.results !== null && responseResults.length > responseJSON.results.length) {
        responseJSON.results = responseResults
      }

      return responseJSON
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
