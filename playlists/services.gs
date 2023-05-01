let PlaylistService

/**
 * Service class for playlists.
 * @extends CommonService
 * @return {Class} The service class.
 */
function PlaylistService_() {
  if (PlaylistService === undefined) PlaylistService = class PlaylistService extends CommonService_() {
    /**
     * Create a playlist service.
     */
    constructor() {
      super(Playlist_(), "playlists")
    }

    /**
     * Get public playlists by channel ID.
     * @param {String} [channelId] - The channel ID.
     * @param {Object} [options] - An optional object of options to include: { parameters: Object; limit: Number; pageToken: String; }
     * @return {Array[Array[Playlist], String|undefined]} An array containing the playlists and next page token.
     */
    getByChannelId(channelId, options = {}) {
      let ytPlaylists
      let nextPageToken
      let wrapperPlaylists

      if (settings().isYoutubeApiEnabled() === true) {
        [ytPlaylists, nextPageToken] = youtube().getChannelPlaylists(channelId, options.limit, options.pageToken)
      }

      const parameters = {
        "visible": true,
        "channel": channelId,
        ...options.parameters
      }
      wrapperPlaylists = super.getByFilter(parameters, ytPlaylists)
      return [wrapperPlaylists, nextPageToken]
    }
  }

  return PlaylistService
}

let thePlaylistService

/**
 * Get the playlist service.
 * return {PlaylistService} The service object.
 */
function playlists() {
  if (thePlaylistService === undefined) {
    thePlaylistService = new (PlaylistService_())()
  }

  return thePlaylistService
}
