/**
 * Model class for YouTube videos.
 */
class Video {

  /**
   * Creates a video object.
   *
   * @param {String} id The video ID.
   * @param {String} title The video title.
   * @param {String} wikiStatus The video wiki status.
   * @param {String} youtubeStatus The video YouTube status.
   * @param {Date} uploadDate The video YouTube status.
   * @param {String} length The video length.
   * @param {String} description The video description.
   * @param {Integer} viewCount The video view count.
   * @param {Integer} likeCount The video like count.
   * @param {Integer} dislikeCount The video dislike count (discontinued).
   * @param {Integer} commentCount The video comment count.
   */
  constructor(id, title, wikiStatus, youtubeStatus, uploadDate, length, description, viewCount, likeCount, dislikeCount, commentCount) {
    this.id = id;
    this.title = title;
    this.wikiStatus = wikiStatus;
    this.youtubeStatus = youtubeStatus;
    this.uploadDate = uploadDate;
    this.length = length;
    this.description = description;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.dislikeCount = dislikeCount;
    this.commentCount = commentCount;
  }

}
