let PlaylistService

/**
 * Service class for playlists.
 * @extends CachedService
 * @return {Class} The service class.
 */
function PlaylistService_() {
  if (PlaylistService === undefined) PlaylistService = class PlaylistService extends CachedService_() {
    /**
     * Create a playlist service.
     */
    constructor() {
      super()
    }

    getById(playlistId) {

    }

    getAll() {

    }

    updateAll() {
      
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
