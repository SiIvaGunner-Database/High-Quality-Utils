const AUTH_TOKEN_KEY = "authToken"
const utils = {}

// Public utilities

/**
 * Sets an admin authentication token for access to the siivagunnerdatabase.net API.
 * The authentication token must be set before the service classes can be used.
 * This can also be done manually by going to project settings and adding a script property with the key "authToken".
 * @param {ScriptProperties} scriptProperties - The script properties object.
 * @param {String} value - The authentication token.
 */
function setAuthToken(scriptProperties, value) {
  scriptProperties.setProperty(AUTH_TOKEN_KEY, value)
}

// Private utilities

/**
 * Get a date in the format "yyyy-MM-dd   HH:mm:ss".
 * @param {String | Date} date - The date to be formatted.
 * @return {Date} The formatted date.
 */
utils.formatDate = function(date) {
  SpreadsheetApp.getActive().getActiveCell().getSheet().date
  return Utilities.formatDate(new Date(date), "UTC", "yyyy-MM-dd   HH:mm:ss")
}

/**
 * Get a string in the appropriate format: "h:mm:ss", "mm:ss", or "ss".
 * @param {String} length - The video length metadata.
 * @return {String} The formatted length.
 */
utils.formatLength = function(length) {
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
utils.getYoutubeHyperlink = function(youtubeId) {
  let hyperlink = ""

  if (youtubeId.length == 11) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/watch?v=' + youtubeId + '", "' + youtubeId + '")'
  } else if (youtubeId.includes("PL")) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/playlist?list=' + youtubeId + '", "' + youtubeId + '")'
  } else if (youtubeId.includes("UC")) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/channel/' + youtubeId + '", "' + youtubeId + '")'
  }

  return hyperlink
}

/**
 * Returns a sheet hyperlink to a Fandom page URL.
 * @param {String} pageName - The name of the wiki page.
 * @param {String} wikiName - The name of the wiki.
 * @return {String} The formatted hyperlink.
 */
utils.formatFandomHyperlink = function(pageName, wikiName) {
  const wikiUrl = "https://" + wikiName + ".fandom.com/wiki/"
  pageName = pageName.replace(/Reupload: /g, "").replace(/Reup: /g, "")
  const simplePageName = pageName.replace(/"/g, '""').replace(/ \(GiIvaSunner\)/g, "")
  const encodedPageName = encodeURIComponent(formatFandomPageName(pageName))
  return '=HYPERLINK("' + wikiUrl + encodedPageName + '", "' + simplePageName + '")'
}

/**
 * Returns an formatted page name for a Fandom page URL.
 * Removes characters and slurs restricted by Fandom article names.
 * @param {String} pageName - The name of the wiki page.
 * @return {String} The formatted page name.
 */
utils.formatFandomPageName = function(pageName) {
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
 * Gets an siivagunnerdatabase.net admin authentication token stored in a script property.
 * @param {ScriptProperties} scriptProperties - The script properties object.
 * @return {String} The authentication token.
 * @throws {MissingPropertyError} Thrown if no script property with the key 'authToken' exists.
 */
utils.getAuthToken = function(scriptProperties) {
  if (!scriptProperties.getProperty(AUTH_TOKEN_KEY)) {
    throw new MissingPropertyError(AUTH_TOKEN_KEY)
  }

  return "Token " + scriptProperties.getProperty(AUTH_TOKEN_KEY)
}

/**
 * Logs a message to the event log spreadsheet.
 * @param {String} message - The message to log.
 */
utils.logEvent = function(message) {
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
 * @return {Object} The response.
 */
utils.getUrlResponse = function(url, allowFailureCodes) {
  allowFailureCodes = allowFailureCodes || false
  const start = new Date()
  let response

  while (!response) {
    try {
      response = UrlFetchApp.fetch(url, {muteHttpExceptions: allowFailureCodes})
    } catch (e) {
      if (e.toString().includes("429")) {
        Logger.log("HTTP 429: too many requests waiting 30 seconds")
        Utilities.sleep(30000)
      } else {
        Logger.log(e)
        Utilities.sleep(1000)
      }

      if (new Date().getTime() - start.getTime() > 120000) {
        Logger.log("2 minutes exceeded timing out")
        break
      }
    }
  }

  return response
}

/**
 * Gets data from the siivagunnerdatabase.net API.
 * This will fail if the user doesn't have permission.
 * @param {String} [apiPath] - The path to append to /api/.
 * @param {String} [method] - The method to use, defaults to get.
 * @param {Object | Array[Object]} [data] - The data to send.
 * @return {Object} The JSON response object.
 */
utils.getDatabaseResponse = function(apiPath, method, data) {
  if (data) {
    // Convert to Array[]
    if (!Array.isArray(data)) {
      data = [data]
    }

    // Set any required fields
    if (apiPath == "rips") {
      const channelId = YouTube.Videos.list("snippet", {id: data[0].id}).items[0].snippet.channelId

      data.forEach((video, index) => {
        video.channel = channelId
        video.author = 2 // spreadsheet-bot
        video.visible = true
        data[index] = video
      })
    } else if (apiPath == "channels") {
      data.forEach((channel, index) => {
        channel.author = 2 // spreadsheet-bot
        channel.visible = true
        data[index] = channel
      })
    }
  }

  const url = "https://siivagunnerdatabase.net/api/" + apiPath || ""
  const options = {
    method: method || "GET",
    contentType: "application/json",
    headers: { Authorization: getAuthToken() }, // TODO - Fix auth token call
    payload: JSON.stringify(data || {})
  }
  const response = UrlFetchApp.fetch(url, options)
  return JSON.parse(response.getContentText())
}

/**
 * Gets the status of a YouTube video, playlist, or channel.
 * @param {String} youtubeId - The YouTube video, playlist, or channel ID.
 * @return {String} The status: "Public", "Unlisted", "Unavailable", "Private", or "Deleted".
 */
utils.getYouTubeStatus = function(youtubeId) {
  let url = ""

  if (youtubeId.length == 11) {
    url = "https://www.youtube.com/watch?v=" + youtubeId
  } else if (youtubeId.includes("PL")) {
    url = "https://www.youtube.com/playlist?list=" + youtubeId
  } else if (youtubeId.includes("UC")) {
    url = "https://www.youtube.com/channel/" + youtubeId
  } else {
    return null
  }

  let youtubeStatus = ""

  if (youtubeId.length == 11) {
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

    if (responseCode == 200) {
      youtubeStatus = "Public"
    } else if (responseCode == 403) {
      youtubeStatus = "Private"
    } else if (responseCode == 404) {
      youtubeStatus = "Deleted"
    } else {
      logEvent("HTTP " + responseCode + ": " + url)
    }
  }

  return youtubeStatus
}
