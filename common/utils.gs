let Utils

/**
 * Utility class for static methods.
 * @return {Class} The utility class.
 */
function Utils_() {
  if (Utils === undefined) Utils = class Utils {
    /**
     * Get a string with the first letter capitalized.
     * @param {String} value - The value to capitalize.
     * @return {String} The capitalized value.
     */
    capitalizeString(value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    /**
     * Get a stringified object with all keys sorted alphabetically.
     * @param {String} object - The object to stringify.
     * @return {String} The stringified object.
     */
    stringifySortedObject(object) {
      return JSON.stringify(this.sortObject(object))
    }

    /**
     * Get an object with all keys sorted alphabetically.
     * @param {String} object - The object to sort.
     * @return {String} The sort object.
     */
    sortObject(object) {
      return Object.fromEntries(
        Object.entries(object).map(([key, value]) => {
          if (typeof value === "object") {
            // Sort any sub-objects
            return [key, this.sortObject(value)]
          } else {
            return [key, value]
          }
        }).sort()
      )
    }

    /**
     * Get a date in the format "yyyy-MM-dd   HH:mm:ss".
     * @param {String | Date} [date] - An optional date to format. Defaults to the current date.
     * @return {Date} The formatted date.
     */
    formatDate(date = new Date()) {
      return Utilities.formatDate(new Date(date), "UTC", "yyyy-MM-dd   HH:mm:ss")
    }

    /**
     * Get a string in the appropriate format: "h:mm:ss", "mm:ss", or "ss".
     * @param {String} length - The video length metadata.
     * @return {String} The formatted length.
     */
    formatLength(length) {
      let date = new Date()

      if (length.includes("H")) {
        date.setHours(length.replace(/(PT|H.*)/g, ""))
      } else {
        date.setHours(0)
      }

      if (length.includes("M")) {
        date.setMinutes(length.replace(/(PT|.*H|M.*)/g, ""))
      } else {
        date.setMinutes(0)
      }

      if (length.includes("S")) {
        date.setSeconds(length.replace(/(PT|.*H|.*M|S.*)/g, ""))
      } else {
        date.setSeconds(0)
      }

      if (length.includes("H")) {
        date = Utilities.formatDate(date, "UTC", "h:mm:ss")
      } else if (length.includes("M")) {
        date = Utilities.formatDate(date, "UTC", "m:ss")
      } else {
        date = Utilities.formatDate(date, "UTC", "s")
      }

      return date
    }

    /**
     * Get a formatted hyperlink.
     * @param {String} url - The URL to link to.
     * @param {String} label - The label to show.
     * @return {String} The hyperlink formula.
     */
    formatHyperlink(url, label) {
      if (label !== undefined) {
        return `=HYPERLINK("${url}", "${label}")`
      } else {
        return ""
      }
    }

    /**
     * Get a hyperlink to a YouTube video, playlist, or channel URL.
     * @param {String} youtubeId - The video, playlist, or channel ID.
     * @return {String} The hyperlink formula.
     */
    formatYoutubeHyperlink(youtubeId) {
      let url = ""

      if (youtubeId.length === 11) {
        url = `https://www.youtube.com/watch?v=${youtubeId}`
      } else if (youtubeId.includes("PL")) {
        url = `https://www.youtube.com/playlist?list=${youtubeId}`
      } else if (youtubeId.includes("UC")) {
        url = `https://www.youtube.com/channel/${youtubeId}`
      } else {
        return youtubeId
      }

      return this.formatHyperlink(url, youtubeId)
    }

    /**
     * Get a hyperlink to a Fandom page URL.
     * @param {String} pageName - The name of the wiki page.
     * @param {String} wikiName - The name of the wiki.
     * @return {String} The hyperlink formula.
     */
    formatFandomHyperlink(pageName, wikiName) {
      if (wikiName === undefined) {
        return pageName
      }

      const wikiUrl = `https://${wikiName}.fandom.com/wiki/`
      const safePageName = pageName.replace(/Reupload: /g, "").replace(/Reup: /g, "")
      const simplePageName = safePageName.replace(/"/g, '""').replace(/ \(GiIvaSunner\)/g, "")
      const encodedPageName = encodeURIComponent(this.formatFandomPageName(safePageName))
      return this.formatHyperlink(wikiUrl + encodedPageName, simplePageName)
    }

    /**
     * Get a formatted page name for a Fandom page URL.
     * Removes characters and slurs restricted by Fandom article names.
     * @param {String} pageName - The name of the wiki page.
     * @return {String} The formatted page name.
     */
    formatFandomPageName(pageName) {
      pageName = pageName.replace(/#/g, "")
      pageName = pageName.replace(/\|/g, "")
      pageName = pageName.replace(/\[/g, "(")
      pageName = pageName.replace(/\]/g, ")")
      pageName = pageName.replace(/\{/g, "(")
      pageName = pageName.replace(/\}/g, ")")
      pageName = pageName.replace(/\​\|\​_/g, "L")
      pageName = pageName.replace(/Nigga/g, "N----")
      return pageName
    }

    /**
     * Fetch all category members in the provided category.
     * @param {String} wikiName - The name of the channel's wiki.
     * @param {String} categoryTitle - The title of the fandom category.
     * @return {Array[Object]} The category members.
     */
    fetchFandomCategoryMembers(wikiName, categoryTitle) {
      const categoryMembers = []
      let cmcontinue = ""

      while (cmcontinue !== undefined) {
        let url = `https://${wikiName}.fandom.com/api.php?` 
        const params = {
          "action": "query",
          "format": "json",
          "cmcontinue": encodeURIComponent(cmcontinue),
          "cmlimit": "50",
          "cmtitle": "Category:" + encodeURIComponent(categoryTitle),
          "list": "categorymembers"
        }

        Object.entries(params).forEach(([key, value]) => url += `&${key}=${value}`)
        const response = UrlFetchApp.fetch(url)
        const content = JSON.parse(response.getContentText())
        categoryMembers.push(...content.query.categorymembers)
        cmcontinue = (content.continue !== undefined ? content.continue.cmcontinue : undefined)
      }

      return categoryMembers
    }

    /**
     * Fetch the video ID from a video article.
     * If the video isn't unlisted or removed, use the YouTube API instead.
     * @param {String} wikiName - The name of the channel's wiki.
     * @param {String} videoTitle - The title of the video.
     * @return {String} The video ID.
     */
    fetchFandomVideoId(wikiName, videoTitle) {
      let url = `https://${wikiName}.fandom.com/api.php?`
      const params = {
        "action": "query",
        "format": "json",
        "prop": "revisions",
        "rvprop": "content",
        "titles": encodeURIComponent(videoTitle)
      }

      Object.entries(params).forEach(([key, value]) => url += `&${key}=${value}`)
      console.info(url)

      const response = UrlFetchApp.fetch(url)
      const content = response.getContentText().replace(/\\n/g, "").replace(/\|/g, "\n")

      // If no link parameter is found in the rip template
      if (content.includes("\nlink") === false) {
        throw new Error(`No ID found for the video title "${videoTitle}"\n${url}`)
      }

      // Extract the value from the link parameter in the rip template
      const idPattern = new RegExp("link(.*)\n")
      let id = idPattern.exec(content).toString().split(",").pop().replace("=", "").trim()

      // If the value is not a plain video ID, remove extra URL and HTML components
      if (id.length !== 11) {
        id = id.replace(/.*v=/g, "").replace(/.*be\//g, "").replace(/<.*/g, "").replace(/ .*/g, "")
      }

      return id
    }

    /**
     * Log a message to the event log spreadsheet.
     * @param {String} message - The message to log.
     */
    logAlert(message) {
      const data = {
        "author": 2, // spreadsheet-bot
        "message": message
      }
      database().postData("alerts", data)
    }
  }

  return Utils
}

let theUtils

/**
 * Get the common utils.
 * return {Utils} The utility object.
 */
function utils() {
  if (theUtils === undefined) {
    theUtils = new (Utils_())()
  }

  return theUtils
}
