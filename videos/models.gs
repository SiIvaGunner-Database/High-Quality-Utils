let Video

/**
 * Model class representing a video.
 * @return {Class} The model class.
 */
function Video_() {
  if (Video === undefined) Video = class Video extends CommonModel_() {
    /**
     * Creates a video object.
     * @param {Object} youtubeObject - The YouTube metadata.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(youtubeObject, databaseObject) {
      super(youtubeObject, databaseObject, videos())
    }

    /**
     * Get the parent channel object.
     * @return {Channel} The channel object.
     */
    getChannel() {
      // TODO
      return {}
    }

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()
      // TODO fetch YouTube URL
      return statuses.public
    }

    /**
     * Get the status of the video on the channel wiki.
     * @return {String} Either "Documented" or "Undocumented".
     */
    getWikiStatus() {
      // TODO rewrite this
      const wiki = this.getChannel().getDatabaseObject().wiki
      const pageName = super.getDatabaseObject().title
      const encodedPageName = encodeURIComponent(formatFandomPageName(pageName))
      const url = "https://" + wiki + ".fandom.com/wiki/" + encodedPageName
      const statusCode = getUrlResponse(url, true).getResponseCode()

      if (statusCode === 200) {
        return "Documented"
      } else if (statusCode === 404) {
        return "Undocumented"
      }

      throw "An unexpected URL status was encountered"
    }
  }

  return Video
}
