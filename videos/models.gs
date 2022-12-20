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
      return videos().getById(this.getDatabaseObject().channel)
    }

    /**
     * Get the status of the YouTube channel.
     * @return {String} The current status.
     */
    getYoutubeStatus() {
      const statuses = youtube().getStatuses()
      const url = `https://www.youtube.com/watch?v=${super.getId()}`
      const contentText = UrlFetchApp.fetch(url).getContentText()

      if (contentText.includes('"isUnlisted":true')) {
        return statuses.unlisted
      } else if (contentText.includes('"status":"OK"')) {
        return statuses.public
      } else if (contentText.includes('"This video is private."')) {
        return statuses.private
      } else if (contentText.includes('"status":"ERROR"')) {
        return statuses.deleted
      } else if (contentText.includes('"status":"UNPLAYABLE"')) {
        return statuses.unavailable
      } else {
        throw `Unexpected response content: ${contentText}`
      }
    }

    /**
     * Get the status of the video on the channel wiki.
     * @return {String} Either "Documented" or "Undocumented".
     */
    getWikiStatus() {
      // TODO? consider using the Fandom API instead; it's slower but more consistent
      const wiki = this.getChannel().getDatabaseObject().wiki
      const pageName = super.getDatabaseObject().title
      const encodedPageName = encodeURIComponent(utils().formatFandomPageName(pageName))
      const url = `https://${wiki}.fandom.com/wiki/${encodedPageName}`
      const options = { muteHttpExceptions: true }
      const responseCode = UrlFetchApp.fetch(url, options).getResponseCode()

      switch(responseCode) {
        case 200:
          return "Documented"
        case 404:
          return "Undocumented"
        default:
          throw `Unexpected response code: ${responseCode}`
      }
    }
  }

  return Video
}
