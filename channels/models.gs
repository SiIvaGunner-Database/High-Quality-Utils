let Channel

/**
 * Model class representing a channel.
 * @extends CommonModel
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
      const columnConfig = {
        sortColumn: 5,
        columns: {
          1: "id",
          2: "title",
          3: "wiki",
          4: "channelStatus",
          5: "publishedAt",
          6: "description",
          7: "videoCount",
          8: "subscriberCount",
          9: "viewCount"
        }
      }
      super(youtubeObject, databaseObject, channels(), columnConfig)
    }

    /**
     * Get the associated spreadsheet object.
     * @return {WrapperSpreadsheet} The spreadsheet object.
     */
    getSpreadsheet() {
      return spreadsheets().getById(this.getDatabaseObject().productionSpreadsheet)
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
      const playlists = []
      let nextPageToken = ""

      while (nextPageToken !== null) {
        const parameters = {
          channelId: super.getId(),
          maxResults: 50,
          pageToken: nextPageToken
        }
        const playlist = YouTube.Playlists.list("snippet,contentDetails", parameters)
        playlists.push(...playlist.items)
        nextPageToken = playlist.nextPageToken
      }

      return playlists
    }

    /**
     * Get the metadata from a YouTube channel's uploads.
     * @param {String} channelId - The YouTube channel ID.
     * @param {Number} [limit] - The video count limit.
     * @return {Array[Object]} The video objects.
     */
    getVideos(channelId, limit) {
      const channel = YouTube.Channels.list("contentDetails", {id: channelId}).items[0]
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads
      return this.getPlaylistItems(uploadsPlaylistId, limit)
    }

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()

      try {
        youtube().getChannel(super.getId())
        return statuses.public
      } catch (error) {
        console.log(error)
        return statuses.deleted
      }
    }
  }

  return Channel
}
