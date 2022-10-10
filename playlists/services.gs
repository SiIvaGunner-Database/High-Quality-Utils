/**
 * Service class for YouTube playlists.
 */
class PlaylistService {

  /**
   * Creates a new playlist service.
   */
  constructor() {
  }

  /**
   * Gets JSON data from a YouTube playlist.
   *
   * @param {String} playlistId The YouTube video ID.
   * @returns {Object} Returns the playlist object.
   */
  getPlaylist(playlistId) {
    return getPlaylists([playlistId]).join("");
  }

  /**
   * Gets JSON data from multiple YouTube playlists.
   *
   * @param {Array[String]} playlistIds The YouTube playlist IDs.
   * @returns {Object} Returns the playlist objects.
   */
  getPlaylists(playlistIds) {
    try {
      const playlists = [];
      const arrayOfIds = playlistIds.slice();
      let stringOfIds = "";

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
          ));
        });
      }

      return playlists;
    } catch(e) {
      Logger.log(e);
    }
  }

}

/**
 * Constant playlist service variable.
 */
const playlistService = new PlaylistService();

/**
 * Returns a new playlist service instance.
 */
function getPlaylistService() {
  return playlistService;
}
