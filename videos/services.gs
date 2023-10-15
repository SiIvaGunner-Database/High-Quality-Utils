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
     * @param {String} channelId - The channel ID.
     * @param {Object} [options] - An optional object of options to include: { parameters: Object; limit: Number; pageToken: String; }
     * @return {Array[Array[Video], String|undefined]} An array containing the videos and next page token.
     */
    getByChannelId(channelId, options = {}) {
      let ytVideos
      let nextPageToken
      let wrapperVideos

      if (settings().isYoutubeApiEnabled() === true) {
        [ytVideos, nextPageToken] = youtube().getChannelVideos(channelId, (options.youtubeLimit | options.limit), options.pageToken)
      }

      const parameters = {
        "visible": true,
        "channel": channelId,
        ...options.parameters
      }

      wrapperVideos = super.getByFilter(parameters, ytVideos, options.databaseLimit)
      return [wrapperVideos, nextPageToken]
    }

    /**
     * Get public videos by playlist ID.
     * Note that database objects are only included when they are set in the playlist from the database side.
     * @param {String} playlistId - The playlist ID.
     * @param {Object} [options] - An optional object of options to include: { parameters: Object; limit: Number; pageToken: String; }
     * @return {Array[Array[Video], String|undefined]} An array containing the videos and next page token.
     */
    getByPlaylistId(playlistId, options = {}) {
      let ytVideos
      let nextPageToken
      let wrapperVideos

      if (settings().isYoutubeApiEnabled() === true) {
        [ytVideos, nextPageToken] = youtube().getPlaylistVideos(playlistId, (options.youtubeLimit | options.limit), options.pageToken)
      }

      const parameters = {
        "visible": true,
        "playlists": playlistId,
        ...options.parameters
      }

      wrapperVideos = super.getByFilter(parameters, ytVideos, options.databaseLimit)
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
