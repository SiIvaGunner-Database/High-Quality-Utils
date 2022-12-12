let PlaylistService

/**
 * Service class for playlists.
 * @extends CachedService
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
