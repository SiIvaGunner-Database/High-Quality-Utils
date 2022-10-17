/**
 * Service class for channels.
 */
class ChannelService {

  /**
   * Create a channel service.
   */
  constructor() {
    this._cache = []
  }

  getById(channelId) {

  }

  getAll() {

  }

  updateAll() {
    
  }

  /**
   * Gets JSON data from a YouTube channel.
   * @param {String} channelId - The YouTube channel ID.
   * @return {Object} The channel object.
   */
  getYoutubeChannel_(channelId) {
    return getYoutubeChannels([channelId]).join("")
  }

  /**
   * Gets JSON data from multiple YouTube channels.
   * @param {Array[String]} channelIds - The YouTube channel IDs.
   * @return {Object} The channel objects.
   */
  getYoutubeChannels_(channelIds) {
    try {
      const channels = []
      const arrayOfIds = channelIds.slice()
      let stringOfIds = ""

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
          ))
        })
      }

      return channels
    } catch(e) {
      Logger.log(e)
    }
  }

  getDatabaseChannel_(channelId) {
    
  }

  getDatabaseChannels_(channelIds) {
    
  }

  updateDatabaseChannels_(channels) {
    
  }

}

/**
 * The constant channel service.
 */
const channelService = new ChannelService()

/**
 * Get the channel service instance.
 * @return {ChannelService} The channel service.
 */
function getChannelService() {
  return channelService
}
