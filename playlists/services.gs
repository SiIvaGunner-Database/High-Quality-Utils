let PlaylistService

/**
 * Service class for playlists.
 * @return {Class} The service class.
 */
function PlaylistService_() {
  if (PlaylistService == undefined) PlaylistService = class PlaylistService {
    /**
     * Create a playlist service.
     */
    constructor() {
      this._cache = []
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
function playlistService() {
  if (thePlaylistService == undefined) thePlaylistService = new PlaylistService_()

  return thePlaylistService
}
