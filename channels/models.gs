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

  /**
   * Gets JSON data from a YouTube channel's uploads.
   *
   * @param {String} channelId The YouTube channel ID.
   * @param {Integer} [limit] The video count limit.
   * @returns {Array[Object]} Returns the video objects.
   */
  getChannelUploads(channelId, limit) {
    try {
      const channel = YouTube.Channels.list("contentDetails", {id: channelId}).items[0];
      const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
      return getPlaylistItems(uploadsPlaylistId, limit);
    } catch(e) {
      Logger.log(e);
    }
  }

  /**
   * Gets the status of a Fandom wiki page.
   *
   * @param {String} wikiName The name of the wiki.
   * @param {String} pageName The name of the wiki page.
   * @returns {String} Returns the status: "Documented" or "Undocumented".
   */
  getWikiStatus(wikiName, pageName) {
    const encodedPageName = encodeURIComponent(formatFandomPageName(pageName));
    const url = "https://" + wikiName + ".fandom.com/wiki/" + encodedPageName;
    const statusCode = getUrlResponse(url, true).getResponseCode();
    let wikiStatus = "";

    if (statusCode == 200) {
      wikiStatus = "Documented";
    } else if (statusCode == 404) {
      wikiStatus = "Undocumented";
    }

    return wikiStatus;
  }

}
