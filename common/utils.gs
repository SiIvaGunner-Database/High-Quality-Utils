let Utils

/**
 * Utility class for static methods.
 * @return {Class} The utility class.
 */
function Utils_() {
  if (Utils === undefined) Utils = class Utils {
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
     * Log a message to the event log spreadsheet.
     * @param {String} message - The message to log.
     */
    logAlert(message) {
      const data = {
        author: 2, // spreadsheet-bot
        message: message
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
