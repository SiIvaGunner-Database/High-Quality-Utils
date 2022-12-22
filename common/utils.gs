let Utils;

/**
 * Utility class for static methods.
 * @return {Class} The utility class.
 */
function Utils_() {
  if (Utils === undefined) Utils = class Utils {
    /**
     * Get a date in the format "yyyy-MM-dd   HH:mm:ss".
     * @param {String | Date} date - The date to be formatted.
     * @return {Date} The formatted date.
     */
    formatDate(date) {
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
     * Get a formatted sheet hyperlink to a YouTube video, playlist, or channel URL.
     * @param {String} youtubeId - The video, playlist, or channel ID.
     * @return {String} The formatted hyperlink.
     */
    formatYoutubeHyperlink(youtubeId) {
      let hyperlink = ""

      if (youtubeId.length === 11) {
        hyperlink = '=HYPERLINK("https://www.youtube.com/watch?v=' + youtubeId + '", "' + youtubeId + '")'
      } else if (youtubeId.includes("PL")) {
        hyperlink = '=HYPERLINK("https://www.youtube.com/playlist?list=' + youtubeId + '", "' + youtubeId + '")'
      } else if (youtubeId.includes("UC")) {
        hyperlink = '=HYPERLINK("https://www.youtube.com/channel/' + youtubeId + '", "' + youtubeId + '")'
      }

      return hyperlink
    }

    /**
     * Get a sheet hyperlink to a Fandom page URL.
     * @param {String} pageName - The name of the wiki page.
     * @param {String} wikiName - The name of the wiki.
     * @return {String} The formatted hyperlink.
     */
    formatFandomHyperlink(pageName, wikiName) {
      const wikiUrl = `https://${wikiName}.fandom.com/wiki/`
      pageName = pageName.replace(/Reupload: /g, "").replace(/Reup: /g, "")
      const simplePageName = pageName.replace(/"/g, '""').replace(/ \(GiIvaSunner\)/g, "")
      const encodedPageName = encodeURIComponent(formatFandomPageName(pageName))
      return '=HYPERLINK("' + wikiUrl + encodedPageName + '", "' + simplePageName + '")'
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
    logEvent(message) {
      const data = {
        author: 2,
        message: message
      }
      database().postData("alerts", data)
    }
  }

  return Utils;
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
