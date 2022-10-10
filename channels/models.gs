/**
 * Model class for YouTube channels.
 */
class Channel {

  /**
   * Creates a channel object.
   *
   * @param {String} id The channel ID.
   * @param {String} name The channel name.
   * @param {String} wiki The channel wiki.
   * @param {String} youtubeStatus The channel YouTube status.
   * @param {Date} joinDate The channel join date.
   * @param {String} description The channel description.
   * @param {Integer} videoCount The channel video count.
   * @param {Integer} subscriberCount The channel subscriber count.
   * @param {Integer} viewCount The channel view count.
   */
  constructor(id, name, wiki, youtubeStatus, joinDate, description, videoCount, subscriberCount, viewCount) {
    this.id = id;
    this.name = name;
    this.wiki = wiki;
    this.youtubeStatus = youtubeStatus;
    this.joinDate = joinDate;
    this.description = description;
    this.videoCount = videoCount;
    this.subscriberCount = subscriberCount;
    this.viewCount = viewCount;
  }

}
