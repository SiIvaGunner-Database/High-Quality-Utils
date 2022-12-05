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
    getYoutubeHyperlink(youtubeId) {
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
      const wikiUrl = "https://" + wikiName + ".fandom.com/wiki/"
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
     * Get a siivagunnerdatabase.net admin authentication token stored in a script property.
     * @param {ScriptProperties} scriptProperties - The script properties object.
     * @return {String} The authentication token.
     * @throws {MissingPropertyError} Thrown if no script property with the key "authToken" exists.
     */
    getAuthToken(scriptProperties) {
      if (!scriptProperties.getProperty(this.getAuthTokenKey())) {
        throw new MissingPropertyError(this.getAuthTokenKey())
      }

      return "Token " + scriptProperties.getProperty(this.getAuthTokenKey())
    }

    /**
     * Get the constant authentication token key.
     * @return {String} The authentication token key.
     */
    getAuthTokenKey() {
      return "authToken"
    }

    /**
     * Log a message to the event log spreadsheet.
     * @param {String} message - The message to log.
     */
    logEvent(message) {
      const projectId = ScriptApp.getScriptId()
      const projectName = DriveApp.getFileById(projectId).getName()
      const date = new Date()
      const event = new Event(projectName, message, date)
      const eventSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Events")
      addToSheet(eventSheet, event)
    }

    /**
     * Gets a response from a get request to a URL.
     * @param {String} url - The URL to fetch.
     * @param {Boolean} [allowFailureCodes] - Whether or not to allow failure response codes, defaults to false.
     * @return {Object} The response object.
     */
    getUrlResponse(url, allowFailureCodes) {
      allowFailureCodes = allowFailureCodes || false
      const start = new Date()
      let response

      while (!response) {
        try {
          response = UrlFetchApp.fetch(url, { muteHttpExceptions: allowFailureCodes })
        } catch (e) {
          if (e.toString().includes("429")) {
            console.log("HTTP 429: too many requests waiting 30 seconds")
            Utilities.sleep(30000)
          } else {
            console.error(e)
            Utilities.sleep(1000)
          }

          if (new Date().getTime() - start.getTime() > 120000) {
            console.log("2 minutes exceeded timing out")
            break
          }
        }
      }

      return response
    }

    /**
     * Get the status of a YouTube video, playlist, or channel.
     * @param {String} youtubeId - The YouTube video, playlist, or channel ID.
     * @return {String} One of the following: "Public", "Unlisted", "Unavailable", "Private", or "Deleted".
     */
    getYouTubeStatus(youtubeId) {
      let url = ""

      if (youtubeId.length === 11) {
        url = "https://www.youtube.com/watch?v=" + youtubeId
      } else if (youtubeId.includes("PL")) {
        url = "https://www.youtube.com/playlist?list=" + youtubeId
      } else if (youtubeId.includes("UC")) {
        url = "https://www.youtube.com/channel/" + youtubeId
      } else {
        return null
      }

      let youtubeStatus = ""

      if (youtubeId.length === 11) {
        const contentText = getUrlResponse(url).getContentText()

        if (contentText.includes('"isUnlisted":true')) {
          youtubeStatus = "Unlisted"
        } else if (contentText.includes('"status":"OK"')) {
          youtubeStatus = "Public"
        } else if (contentText.includes('"This video is private."')) {
          youtubeStatus = "Private"
        } else if (contentText.includes('"status":"ERROR"')) {
          youtubeStatus = "Deleted"
        } else if (contentText.includes('"status":"UNPLAYABLE"')) {
          youtubeStatus = "Unavailable"
        }
      } else {
        const responseCode = getUrlResponse(url, true).getResponseCode()

        if (responseCode === 200) {
          youtubeStatus = "Public"
        } else if (responseCode === 403) {
          youtubeStatus = "Private"
        } else if (responseCode === 404) {
          youtubeStatus = "Deleted"
        } else {
          logEvent("HTTP " + responseCode + ": " + url)
        }
      }

      return youtubeStatus
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
  if (theUtils === undefined) theUtils = new Utils_()

  return theUtils
}
