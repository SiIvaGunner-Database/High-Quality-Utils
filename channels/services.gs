let ChannelService

/**
 * Service class for channels.
 * @extends CachedService
 * @return {Class} The service class.
 */
function ChannelService_() {
  if (ChannelService === undefined) ChannelService = class ChannelService extends CommonService_() {
    /**
     * Create a channel service.
     */
    constructor() {
      super(Channel_(), "channels")
    }
  }

  return ChannelService
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
