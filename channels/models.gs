let Channel;

/**
 * Model class representing a channel.
 * @return {Class} The model class.
 */
function Channel_() {
  if (Channel === undefined) Channel = class Channel {
    /**
     * Create a channel object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      this._ytObject = youtubeObject
      this._dbObject = databaseObject
    }

    getSpreadsheet() {
      return spreadsheets().getById(this.getDatabaseObject().productionSheet)
    }

    getPlaylists() {

    }

    getYoutubeObject() {
      
    }

    getDatabaseObject() {
      
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
     * Get the metadata from a YouTube channel's uploads.
     * @param {String} channelId - The YouTube channel ID.
     * @param {Integer} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getVideos(channelId, limit) {
      try {
        const channel = YouTube.Channels.list("contentDetails", {id: channelId}).items[0]
        const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads
        return getPlaylistItems(uploadsPlaylistId, limit)
      } catch(e) {
        console.error(e)
      }
    }

    getYoutubeStatus() {

    }

    /**
     * Get the status of a Fandom wiki page.
     * @param {String} wikiName - The name of the wiki.
     * @param {String} pageName - The name of the wiki page.
     * @return {String} Either "Documented" or "Undocumented".
     */
    getWikiStatus(wikiName, pageName) {
      const encodedPageName = encodeURIComponent(formatFandomPageName(pageName))
      const url = "https://" + wikiName + ".fandom.com/wiki/" + encodedPageName
      const statusCode = getUrlResponse(url, true).getResponseCode()
      let wikiStatus = ""

      if (statusCode === 200) {
        wikiStatus = "Documented"
      } else if (statusCode === 404) {
        wikiStatus = "Undocumented"
      }

      return wikiStatus
    }
  }

  return Channel;
}
