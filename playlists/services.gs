/**
 * Service class for playlists.
 */
class PlaylistService {

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

  /**
   * Gets JSON data from a YouTube playlist.
   * @param {String} playlistId - The YouTube video ID.
   * @return {Object} The playlist object.
   */
  getYoutubePlaylist_(playlistId) {
    return getYoutubePlaylists([playlistId]).join("")
  }

  /**
   * Gets JSON data from multiple YouTube playlists.
   * @param {Array[String]} playlistIds - The YouTube playlist IDs.
   * @return {Object} The playlist objects.
   */
  getYoutubePlaylists_(playlistIds) {
    try {
      const playlists = []
      const arrayOfIds = playlistIds.slice()
      let stringOfIds = ""

      while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
        YouTube.Playlists.list("snippet,contentDetails", {id: stringOfIds}).items.forEach((item) => {
          playlists.push(new Playlist(
            item.id,
            item.snippet.title,
            "",
            item.snippet.description,
            item.contentDetails.itemCount,
            "",
            "Public"
          ))
        })
      }

      return playlists
    } catch(e) {
      Logger.log(e)
    }
  }

  getDatabasePlaylist_(playlistId) {
    
  }

  getDatabasePlaylists_(playlistIds) {
    
  }

}

/**
 * The constant playlist service.
 */
const playlistService = new PlaylistService()

/**
 * Get the playlist service instance.
 * @return {PlaylistService} The playlist service.
 */
function getPlaylistService() {
  return playlistService
}
