/**
 * Service class for YouTube channels.
 */
class ChannelService {

  /**
   * Creates a new channel service.
   */
  constructor() {
  }

  /**
   * Gets JSON data from a YouTube channel.
   *
   * @param {String} channelId The YouTube channel ID.
   * @returns {Object} Returns the channel object.
   */
  getChannel(channelId) {
    return getChannels([channelId]).join("");
  }

  /**
   * Gets JSON data from multiple YouTube channels.
   *
   * @param {Array[String]} channelIds The YouTube channel IDs.
   * @returns {Object} Returns the channel objects.
   */
  getChannels(channelIds) {
    try {
      const channels = [];
      const arrayOfIds = channelIds.slice();
      let stringOfIds = "";

      while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
        YouTube.Channels.list("snippet,statistics", {id: stringOfIds}).items.forEach((item) => {
          channels.push(new Channel(
            item.id,
            item.snippet.title,
            "None",
            "Public",
            formatDate(item.snippet.publishedAt),
            item.snippet.description,
            item.statistics.videoCount,
            item.statistics.subscriberCount,
            item.statistics.viewCount
          ));
        });
      }

      return channels;
    } catch(e) {
      Logger.log(e);
    }
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

  /**
   * Gets the names of all members of a Fandom wiki category.
   *
   * @param {String} wikiName The name of the wiki.
   * @param {String} categoryName The name of the wiki category.
   * @returns {Array[String]} Returns all category member names.
   */
  getCategoryMembers(wikiName, categoryName) {
    const categoryMembers = [];
    let cmcontinue = "";

    while (cmcontinue != null) {
      const params = {
        action: "query",
        list: "categorymembers",
        cmtitle: "Category:" + encodeURIComponent(categoryName),
        cmlimit: "500",
        cmcontinue: encodeURIComponent(cmcontinue),
        format: "json"
      };

      let url = "https://" + wikiName + ".fandom.com/api.php?"; 
      Object.keys(params).forEach(key => url += "&" + key + "=" + params[key]);

      try {
        const contentText = getUrlResponse(url).getContentText();
        const json = JSON.parse(contentText);
        categoryMembers = categoryMembers.concat(json.query.categorymembers);
        cmcontinue = json.continue ? json.continue.cmcontinue : null;
      } catch (e) {
        Logger.log(e);
      }
    }

    return categoryMembers.map(categoryMember => categoryMember.title);
  }
}

