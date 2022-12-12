let VideoService

/**
 * Service class for videos.
 * @extends CachedService
 * @return {Class} The service class.
 */
function VideoService_() {
  if (VideoService === undefined) VideoService = class VideoService extends CommonService_() {
    /**
     * Create a video service.
     */
    constructor() {
      super(Video_(), "videos")
    }
  }

  return VideoService
}

let theVideoService

/**
 * Get the video service.
 * return {VideoService} The service object.
 */
function videos() {
  if (theVideoService === undefined) {
    theVideoService = new (VideoService_())()
  }

  return theVideoService
}
