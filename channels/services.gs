let ChannelService;

/**
 * Service class for channels.
 * @extends CachedService
 * @return {Class} The service class.
 */
function ChannelService_() {
  if (ChannelService === undefined) ChannelService = class ChannelService extends CachedService_() {
    /**
     * Create a channel service.
     */
    constructor() {
      super()
    }

    /**
     * Get a channel by its ID.
     * @param {String} channelId - The channel ID.
     * @return {Channel} The channel object.
     */
    getById(channelId) {
      if (super.isCached(channelId)) {
        return super.getCachedObject(channelId)
      }

      const ytChannel = youtube().getChannels(channelId)
      const dbChannel = database().getData("channels/" + channelId)
      const channel = new (Channel_())(ytChannel, dbChannel)
      super._cache.push(channel)
      return channel
    }

    getAll() {

    }

    updateAll() {

    }
  }

  return ChannelService;
}

let theChannelService

/**
 * Get the channel service.
 * return {ChannelService} The service object.
 */
function channels() {
  if (theChannelService === undefined) {
    theChannelService = new (ChannelService_())()
  }

  return theChannelService
}
