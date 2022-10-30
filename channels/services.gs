let ChannelService;

/**
 * Service class for channels.
 * @return {Class} The service class.
 */
function ChannelService_() {
  if (ChannelService == undefined) ChannelService = class ChannelService {
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
  }

  return ChannelService;
}

let theChannelService

/**
 * Get the channel service.
 * return {ChannelService} The service object.
 */
function channelService() {
  if (theChannelService == undefined) theChannelService = new ChannelService_()

  return theChannelService
}
