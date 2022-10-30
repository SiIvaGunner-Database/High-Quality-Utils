let Video

/**
 * Model class representing a video.
 * @return {Class} The model class.
 */
function Video_() {
  if (Video == undefined) Video = class Video {
    /**
     * Creates a video object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      this._ytObject = youtubeObject
      this._dbObject = databaseObject
    }

    getSpreadsheet() {
      
    }

    getChannel() {
      
    }

    getPlaylists() {

    }

    getYoutubeObject() {
      
    }

    getDatabaseObject() {
      
    }

    getYoutubeStatus() {

    }

    getWikiStatus() {

    }

    getChanges() {

    }

    hasChanges() {

    }

    update() {

    }

    logChanges_() {

    }
  }

  return Video
}
