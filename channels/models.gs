let Channel;

/**
 * Model class representing a channel.
 * @return {Class} The model class.
 */
function Channel_() {
  if (Channel === undefined) Channel = class Channel extends CommonModel_() {
    /**
     * Create a channel object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      super(youtubeObject, databaseObject, channels())
    }

    /**
     * Get the associated spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      return spreadsheets().getById(this.getDatabaseObject().productionSheet)
    }

    /**
     * Get the associated sheet object.
     * @return {WrapperSheet} The sheet object.
     */
    getSheet() {
      return this.getSpreadsheet().getSheet(this.getDatabaseObject().title)
    }

    /**
     * Get all public playlists on the channel.
     * @return {Array[Playlist]} An array of playlists.
     */
    getPlaylists() {
      // TODO
      return []
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

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()
      // TODO fetch YouTube URL
      return statuses.public
    }
  }

  return Channel;
}
