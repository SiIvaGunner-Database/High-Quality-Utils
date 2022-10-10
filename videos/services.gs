/**
 * Service class for YouTube videos.
 */
class VideoService {

  /**
   * Creates a new video service.
   */
  constructor() {
  }

  /**
   * Gets JSON data from a YouTube video.
   *
   * @param {String} videoId The YouTube video ID.
   * @returns {Object} Returns the video object.
   */
  getVideo(videoId) {
    return getVideos([videoId]).join("");
  }

  /**
   * Gets JSON data from multiple YouTube videos.
   *
   * @param {Array[String]} videoIds The YouTube video IDs.
   * @returns {Object} Returns the video objects.
   */
  getVideos(videoIds) {
    const videos = [];
    const arrayOfIds = videoIds.slice();
    let stringOfIds = "";

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
          ));
        });

        if (videos.length % 1000 < 50 && videos.length > 50) {
          Logger.log("Found " + videos.length + " videos...");
        }
      }
    } catch(e) {
      Logger.log(e);
    }

    return videos;
  }

}

/**
 * Constant video service variable.
 */
const videoService = new VideoService();

/**
 * Returns a new video service instance.
 * 
 * @returns {VideoService} Returns the video service.
 */
function getVideoService() {
  return videoService;
}
