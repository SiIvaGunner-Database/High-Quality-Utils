/**
 * Service class for videos.
 */
class VideoService {

  /**
   * Create a video service.
   */
  constructor() {
    this._cache = []
  }

  getById(videoId) {

  }

  getAll() {

  }

  updateAll() {
    
  }

  /**
   * Gets JSON data from a YouTube video.
   * @param {String} videoId - The YouTube video ID.
   * @return {Object} The video object.
   */
  getYoutubeVideo_(videoId) {
    return getYoutubeVideos([videoId]).join("")
  }

  /**
   * Gets JSON data from multiple YouTube videos.
   * @param {Array[String]} videoIds - The YouTube video IDs.
   * @return {Object} The video objects.
   */
  getYotubeVideos_(videoIds) {
    const videos = []
    const arrayOfIds = videoIds.slice()
    let stringOfIds = ""

    try {
      while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
        YouTube.Videos.list("snippet,contentDetails,statistics", {id: stringOfIds}).items.forEach((item) => {
          videos.push(new Video(
            item.id,
            item.snippet.title,
            "Undocumented",
            "Public",
            formatDate(item.snippet.publishedAt),
            item.contentDetails.duration,
            item.snippet.description,
            item.statistics.viewCount,
            item.statistics.likeCount,
            item.statistics.dislikeCount,
            item.statistics.commentCount
          ))
        })

        if (videos.length % 1000 < 50 && videos.length > 50) {
          Logger.log("Found " + videos.length + " videos...")
        }
      }
    } catch(e) {
      Logger.log(e)
    }

    return videos
  }

  /**
   * Gets JSON data from a YouTube video.
   * @param {String} videoId - The YouTube video ID.
   * @return {Object} The video object.
   */
  getDatabaseVideo_(videoId) {
    return getYoutubeVideos([videoId]).join("")
  }

  /**
   * Gets JSON data from multiple YouTube videos.
   * @param {Array[String]} videoIds - The YouTube video IDs.
   * @return {Object} The video objects.
   */
  getDatabaseVideos_(videoIds) {
    const videos = []
    return videos
  }

}

/**
 * The constant video service.
 */
const videoService = new VideoService()

/**
 * Get the video service instance.
 * @return {VideoService} The video service.
 */
function getVideoService() {
  return videoService
}
