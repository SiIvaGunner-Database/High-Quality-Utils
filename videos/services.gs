let VideoService

/**
 * Service class for videos.
 * @return {Class} The service class.
 */
function VideoService_() {
  if (VideoService == undefined) VideoService = class VideoService {
    /**
     * Create a video service.
     */
    constructor() {
      this._cache = []
    }

    getById(videoId) {

    }

    getAll() {

    }

    updateAll() {
      
    }
  }

  return VideoService
}

let theVideoService

/**
 * Get the video service.
 * return {VideoService} The service object.
 */
function videoService() {
  if (theVideoService == undefined) theVideoService = new VideoService_()

  return theVideoService
}
