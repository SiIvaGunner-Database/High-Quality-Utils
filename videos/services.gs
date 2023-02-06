let VideoService

/**
 * Service class for videos.
 * @extends CommonService
 * @return {Class} The service class.
 */
function VideoService_() {
  if (VideoService === undefined) VideoService = class VideoService extends CommonService_() {
    /**
     * Create a video service.
     */
    constructor() {
      super(Video_(), "videos")
    }

    /**
     * Get public videos by channel ID.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Video], String|undefined]} An array containing the videos and next page token.
     */
    getByChannelId(channelId, limit, pageToken) {
      let ytVideos
      let nextPageToken
      let wrapperVideos

      if (settings().isYoutubeApiEnabled() === true) {
        [ytVideos, nextPageToken] = youtube().getChannelVideos(channelId, limit, pageToken)
      }

      const parameters = {
        "visible": true,
        "channel": channelId
      }
      wrapperVideos = super.getByFilter(parameters, ytVideos)
      return [wrapperVideos, nextPageToken]
    }

    /**
     * Get public videos by playlist ID.
     * @param {Number} [limit] - An optional video count limit.
     * @param {String} [pageToken] - An optional page token to start getting results from.
     * @return {Array[Array[Video], String|undefined]} An array containing the videos and next page token.
     */
    getByPlaylistId(playlistId, limit, pageToken) {
      let ytVideos
      let nextPageToken
      let wrapperVideos

      if (settings().isYoutubeApiEnabled() === true) {
        [ytVideos, nextPageToken] = youtube().getPlaylistVideos(playlistId, limit, pageToken)
      }

      const parameters = {
        "visible": true
        // "playlists": playlistId // TODO - make this work
      }
      wrapperVideos = super.getByFilter(parameters, ytVideos)
      return [wrapperVideos, nextPageToken]
    }
  }

  return VideoService
}

let theVideoService

/**
 * Get the video service.
 * return {VideoService} The service object.
 */
function videos() {
  if (theVideoService === undefined) {
    theVideoService = new (VideoService_())()
  }

  return theVideoService
}
