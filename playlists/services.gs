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
     * @param {Number} [limit] - An optional playlist count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Playlist], String|undefined]} An array containing the playlists and next page token.
     */
    getByChannelId(channelId, limit, pageToken) {
      let ytPlaylists
      let nextPageToken
      let wrapperPlaylists

      if (settings().isYoutubeApiEnabled() === true) {
        [ytPlaylists, nextPageToken] = youtube().getChannelPlaylists(channelId, limit, pageToken)
      }

      const parameters = {
        "visible": true,
        "channel": channelId
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
