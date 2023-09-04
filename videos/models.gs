let Video

/**
 * Model class representing a video.
 * @extends CommonModel
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
      const columnConfig = {
        "sortColumn": 5,
        "columns": {
          1: "id",
          2: "title",
          3: "wikiStatus",
          4: "videoStatus",
          5: "publishedAt",
          6: "duration",
          7: "description",
          8: "viewCount",
          9: "likeCount",
          10: "dislikeCount",
          11: "commentCount"
        }
      }
      super(youtubeObject, databaseObject, videos(), columnConfig)
    }

    /**
     * Get the parent channel object.
     * @return {Channel} The channel object.
     */
    getChannel() {
      const channelId = (super.getDatabaseObject() !== undefined ? super.getDatabaseObject().channel : super.getOriginalObject().channel)
      return channels().getById(channelId)
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
      } else if (contentText.includes('"This video is private"')) {
        return statuses.private
      } else if (contentText.includes('"status":"ERROR"')) {
        return statuses.deleted
      } else if (contentText.includes('"status":"UNPLAYABLE"')) {
        return statuses.unavailable
      } else {
        console.warn(`Unable to find status from URL: ${url}`)

        if (super.getDatabaseObject() !== undefined && super.getDatabaseObject().videoStatus !== "") {
          return super.getDatabaseObject().videoStatus
        } else {
          return statuses.public
        }
      }
    }

    /**
     * Get a hyperlink to the associated wiki article.
     * @return {String} The hyperlink formula.
     */
    getWikiHyperlink() {
      return utils().formatFandomHyperlink(super.getDatabaseObject().title, this.getChannel().getDatabaseObject().wiki)
    }

    /**
     * Get the status of the video on the channel wiki.
     * @return {String} Either "Documented" or "Undocumented".
     */
    getWikiStatus() {
      // TODO use the Fandom API instead; it's slower but more consistent
      const wiki = this.getChannel().getDatabaseObject().wiki

      if (wiki === undefined || wiki === "") {
        return ""
      }

      const pageName = (super.getDatabaseObject() !== undefined ? super.getDatabaseObject().title : super.getOriginalObject().title)
      const encodedPageName = encodeURIComponent(utils().formatFandomPageName(pageName))
      const url = `https://${wiki}.fandom.com/wiki/${encodedPageName}`
      const options = { "muteHttpExceptions": true }
      const responseCode = UrlFetchApp.fetch(url, options).getResponseCode()

      switch (responseCode) {
        case 200:
          return "Documented"
        case 404:
          return "Undocumented"
        default:
          throw new Error(`Unexpected response: ${responseCode}`)
      }
    }
  }

  return Video
}
