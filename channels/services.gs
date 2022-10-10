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

}

/**
 * Constant channel service variable.
 */
const channelService = new ChannelService();

/**
 * Returns a new channel service instance.
 * 
 * @returns {ChannelService} Returns the channel service.
 */
function getChannelService() {
  return channelService;
}
