// Table of Contents
// 1. Global Variables
// 2. General Utilities
// 3. YouTube Utilities
// 4. Sheets Utilities
// 5. Fetch Utilities

//////////////////////
// Global Variables //
//////////////////////

const authToken = "Token " + getAuthToken();

///////////////////////
// General Utilities //
///////////////////////

/**
 * Returns a date in the format "yyyy-MM-dd   HH:mm:ss".
 *
 * @param {String | Date} date The date to be formatted.
 * @returns {Date} Returns the formatted date.
 */
function formatDate(date) {
  return Utilities.formatDate(new Date(date), "UTC", "yyyy-MM-dd   HH:mm:ss");
}

/**
 * Returns a string in the appropriate format: "h:mm:ss", "m:ss", or "s".
 *
 * @param {String} length The length to be formatted.
 * @returns {String} Returns the formatted length.
 */
function formatLength(length) {
  let date = new Date();

  if (length.includes("H")) {
    date.setHours(length.replace(/(PT|H.*)/g, ""));
  } else {
    date.setHours(0);
  }

  if (length.includes("M")) {
    date.setMinutes(length.replace(/(PT|.*H|M.*)/g, ""));
  } else {
    date.setMinutes(0);
  }

  if (length.includes("S")) {
    date.setSeconds(length.replace(/(PT|.*H|.*M|S.*)/g, ""));
  } else {
    date.setSeconds(0);
  }

  if (length.includes("H")) {
    date = Utilities.formatDate(date, "UTC", "h:mm:ss");
  } else if (length.includes("M")) {
    date = Utilities.formatDate(date, "UTC", "m:ss");
  } else {
    date = Utilities.formatDate(date, "UTC", "s");
  }

  return date;
}

/**
 * Returns a sheet hyperlink to a YouTube video, playlist, or channel URL.
 *
 * @param {String} youtubeId The YouTube video, playlist, or channel ID.
 * @returns {String} Returns the formatted hyperlink.
 */
function formatYouTubeHyperlink(youtubeId) {
  let hyperlink;

  if (youtubeId.length == 11) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/watch?v=' + youtubeId + '", "' + youtubeId + '")';
  } else if (youtubeId.includes("PL")) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/playlist?list=' + youtubeId + '", "' + youtubeId + '")';
  } else if (youtubeId.includes("UC")) {
    hyperlink = '=HYPERLINK("https://www.youtube.com/channel/' + youtubeId + '", "' + youtubeId + '")';
  }

  return hyperlink;
}

/**
 * Returns a sheet hyperlink to a Fandom page URL.
 *
 * @param {String} pageName The name of the wiki page.
 * @param {String} String The name of the wiki.
 * @returns {String} Returns the formatted hyperlink.
 */
function formatFandomHyperlink(pageName, wikiName) {
  const wikiUrl = "https://" + wikiName + ".fandom.com/wiki/";
  pageName = pageName.replace(/Reupload: /g, "").replace(/Reup: /g, "");
  const simplePageName = pageName.replace(/"/g, '""').replace(/ \(GiIvaSunner\)/g, "");
  const encodedPageName = encodeFandomPageName(pageName);
  return '=HYPERLINK("' + wikiUrl + encodedPageName + '", "' + simplePageName + '")';
}

/**
 * Returns an encoded page name for a Fandom page URL.
 *
 * @param {String} pageName The name of the wiki page.
 * @returns {String} Returns the encoded page name.
 */
function encodeFandomPageName(pageName) {
  pageName = pageName.replace(/#/g, '');
  pageName = pageName.replace(/\|/g, '');
  pageName = pageName.replace(/\[/g, '(');
  pageName = pageName.replace(/\]/g, ')');
  pageName = pageName.replace(/\{/g, '(');
  pageName = pageName.replace(/\}/g, ')');
  pageName = pageName.replace(/\​\|\​_/g, 'L');
  pageName = pageName.replace(/Nigga/g, 'N----');
  return encodeURIComponent(pageName);
}

///////////////////////
// YouTube Utilities //
///////////////////////

/**
 * Gets JSON data from a YouTube video.
 *
 * @param {String} videoId The YouTube video ID.
 * @returns {Object} Returns the video object.
 */
function getVideo(videoId) {
  return getVideos([videoId]).join("");
}

/**
 * Gets JSON data from multiple YouTube videos.
 *
 * @param {Array[String]} videoIds The YouTube video IDs.
 * @returns {Object} Returns the video objects.
 */
function getVideos(videoIds) {
  try {
    let videos = [];
    let arrayOfIds = videoIds.slice();
    let stringOfIds = "";

    while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
      YouTube.Videos.list("snippet,contentDetails,statistics", {id: stringOfIds}).items.forEach((item) => {
        videos.push(new Video(
          item.snippet.resourceId,
          item.snippet.title,
          "Undocumented",
          "Public",
          formatDate(item.snippet.publishedAt),
          item.contentDetails.duration,
          item.snippet.description,
          item.statistics.videoCount,
          item.statistics.likeCount,
          item.statistics.dislikeCount,
          item.statistics.commentCount
        ));
      });
    }

    return videos;
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Gets JSON data from a YouTube playlist.
 *
 * @param {String} playlistId The YouTube video ID.
 * @returns {Object} Returns the playlist object.
 */
function getPlaylist(playlistId) {
  return getPlaylists([playlistId]).join("");
}

/**
 * Gets JSON data from multiple YouTube playlists.
 *
 * @param {Array[String]} playlistIds The YouTube playlist IDs.
 * @returns {Object} Returns the playlist objects.
 */
function getPlaylists(playlistIds) {
  try {
    let playlists = [];
    let arrayOfIds = playlistIds.slice();
    let stringOfIds = "";

    while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
      YouTube.Playlists.list("snippet,contentDetails", {id: stringOfIds}).items.forEach((item) => {
        playlists.push(new Playlist(
          item.id,
          item.snippet.title,
          "",
          item.snippet.description,
          item.contentDetails.itemCount,
          "",
          "Public"
        ));
      });
    }

    return playlists;
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Gets JSON data from a YouTube channel.
 *
 * @param {String} channelId The YouTube channel ID.
 * @returns {Object} Returns the channel object.
 */
function getChannel(channelId) {
  return getChannels([channelId]).join("");
}

/**
 * Gets JSON data from multiple YouTube channels.
 *
 * @param {Array[String]} channelIds The YouTube channel IDs.
 * @returns {Object} Returns the channel objects.
 */
function getChannels(channelIds) {
  try {
    let channels = [];
    let arrayOfIds = channelIds.slice();
    let stringOfIds = "";

    while ( (stringOfIds = arrayOfIds.splice(-50).join(",")) && stringOfIds ) {
      YouTube.Channels.list("snippet,statistics", {id: stringOfIds}).items.forEach((item) => {
        channels.push(new Channel(
          item.id,
          item.snippet.title,
          "None",
          "Public",
          formatDate(item.snippet.publishedAt),
          item.snippet.description,
          item.statistics.videoCount,
          item.statistics.subscriberCount,
          item.statistics.viewCount
        ));
      });
    }

    return channels;
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Gets JSON data from a YouTube channel's uploads.
 *
 * @param {String} channelId The YouTube channel ID.
 * @param {Integer} [limit] The video count limit.
 * @returns {Array[Object]} Returns the video objects.
 */
function getChannelUploads(channelId, limit) {
  try {
    const channel = YouTube.Channels.list("contentDetails", {id: channelId}).items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    return getPlaylistItems(uploadsPlaylistId, limit);
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Gets JSON data from videos in a YouTube playlist.
 *
 * @param {String} playlistId The YouTube playlist ID.
 * @param {Integer} [limit] The video count limit.
 * @returns {Array[Object]} Returns the video objects.
 */
function getPlaylistItems(playlistId, limit) {
  try {
    let itemIds = [];
    let nextPageToken = "";

    while (nextPageToken != null) {
      const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, maxResults: 50, pageToken: nextPageToken});
      playlist.items.forEach(function(item) {itemIds.push(item.snippet.resourceId)});
      nextPageToken = limit && itemIds.length >= limit ? null : playlist.nextPageToken;
    }

    return getVideos(itemIds);
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Adds a video to a YouTube playlist.
 *
 * @param {String} playlistId The YouTube playlist ID.
 * @param {String} videoId The YouTube video ID.
 */
function addToPlaylist(playlistId, videoId) {
  try {
    YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet");
  } catch(e) {
    Logger.log(e);
  }
}

/**
 * Removes a video from a YouTube playlist.
 *
 * @param {String} playlistId The YouTube playlist ID.
 * @param {String} videoId The YouTube video ID.
 */
function removeFromPlaylist(playlistId, videoId) {
  try {
    const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, videoId: videoId});
    const deletionId = playlist.items[0].id;
    YouTube.PlaylistItems.remove(deletionId);
  } catch(e) {
    Logger.log(e);
  }
}

//////////////////////
// Sheets Utilities //
//////////////////////

/**
 * Gets all data values from a spreadsheet, ignoring the header row.
 *
 * @param {Sheet} sheet The sheet object.
 * @param {String} [dataType] The type of object to return from the values.
 * @returns {Array[Array[Object]]} Returns the values.
 */
function getSheetValues(sheet, dataType) {
  let data = sheet.getDataRange().getValues();
  data.shift(); // Ignore the header row

  if (dataType) {
    switch (dataType.toLowerCase()) {
      case "video":
        data.forEach((row, index) => {
          data[index] = new Video(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]);
        });
        break;
      case "playlist":
        data.forEach((row, index) => {
          data[index] = new Playlist(row[0], row[1], row[2], row[3], row[4], row[5], row[6]);
        });
        break;
      case "channel":
        data.forEach((row, index) => {
          data[index] = new Channel(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
        });
        break;
      case "change":
        data.forEach((row, index) => {
          data[index] = new Change(row[0], row[1], row[2], row[3]);
        });
        break;
    }
  }

  return data;
}

/**
 * Inserts a range of data into a spreadsheet.
 *
 * @param {Sheet} sheet The sheet object.
 * @param {Object | Array[Object]} data The data to insert.
 */
function addToSheet(sheet, data) {
  // Convert to Array[]
  if (!Array.isArray(data)) {
    data = [data];
  }

  sheet.insertRowsBefore(2, data.length);
  updateInSheet(sheet, data, 2);
}

/**
 * Updates a range of data in a spreadsheet.
 *
 * @param {Sheet} sheet The sheet object.
 * @param {Object | Array[Object]} data The data to insert.
 * @param {Integer} row The row to update.
 */
function updateInSheet(sheet, data, row) {
  // Convert to Array[]
  if (!Array.isArray(data)) {
    data = [data];
  }

  // Convert to Array[Array[]]
  for (let i in data) {
    data[i] = Object.values(data[i]);
  }

  sheet.getRange(row, 1, data.length, sheet.getLastColumn()).setValues(data);
}

/**
 * Sorts the given spreadsheet, ignoring the header row.
 *
 * @param {Sheet} sheet The sheet object.
 * @param {Integer} column The column number.
 * @param {Boolean} [ascending] Whether or not to sort in ascending order, defaults to false.
 */
function sortSheet(sheet, column, ascending) {
  ascending = ascending ? true : false;
  // Sort everything but the header row
  sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort({column: column, ascending: ascending});
}

/**
 * Gets an siivagunnerdatabase.net admin authentication token stored in a spreadsheet.
 * This will fail if the user doesn't have permission.
 *
 * @returns {String} Returns the authentication token.
 */
function getAuthToken() {
  const secretSpreadsheet = SpreadsheetApp.openById("1mP5lB6QQQxn0TF_l2sGsrvYDZZ39L-rk_EJrJhif-sI").getActiveSheet();
  return secretSpreadsheet.getActiveRange().getValue();
}

/**
 * Logs a message to the event log spreadsheet.
 *
 * @param {String} message The message to log.
 */
async function logEvent(message) {
  const projectId = ScriptApp.getScriptId();
  const projectName = DriveApp.getFileById(projectId).getName();
  const date = new Date();
  const event = new Event(projectName, message, date);
  const eventSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Events");
  addToSheet(eventSheet, event);
}

/**
 * Logs a change to the changelog spreadsheets.
 *
 * @param {Sheet} sheet The sheet object.
 * @param {String} id The YouTube ID.
 * @param {String} type The type of change.
 * @param {String} oldValue The old value.
 * @param {String} newValue The new value.
 */
async function logChange(sheet, id, type, oldValue, newValue) {
  const change = new Change(formatYouTubeHyperlink(id), type, oldValue, newValue, new Date());
  addToSheet(sheet, change);
  const changelogSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Changelog");
  addToSheet(changelogSheet, change);
}

/////////////////////
// Fetch Utilities //
/////////////////////

/**
 * Gets a response from a get request to a URL.
 *
 * @param {String} url The URL to fetch.
 * @param {Boolean} [allowFailureCodes] Whether or not to allow failure response codes, defaults to false.
 * @returns {Object} Returns the response.
 */
function getUrlResponse(url, allowFailureCodes) {
  allowFailureCodes = allowFailureCodes || false;
  const start = new Date();
  let response;

  while (!response) {
    try {
      response = UrlFetchApp.fetch(url, {muteHttpExceptions: allowFailureCodes});
    } catch (e) {
      if (e.toString().includes("429")) {
        Logger.log("HTTP 429: too many requests; waiting 30 seconds");
        Utilities.sleep(30000);
      } else {
        Logger.log(e);
        Utilities.sleep(1000);
      }

      if (new Date().getTime() - start.getTime() > 120000) {
        Logger.log("2 minutes exceeded; timing out");
        break;
      }
    }
  }

  return response;
}

/**
 * Gets a response from a post request to a URL.
 * Sends the default siivagunnerdatabase.net authentication token in header.
 *
 * @param {String} url The URL to post to.
 * @param {Object} data The data to post.
 * @param {Boolean} [usePutMethod] Whether or not to use the PUT method, defaults to false.
 * @returns {Object} Returns the response.
 */
function postUrlResponse(url, data, usePutMethod) {
  const options = {
    method: usePutMethod ? "put" : "post",
    contentType: "application/json",
    headers: { Authorization: authToken },
    payload: JSON.stringify(data)
  };

  return UrlFetchApp.fetch(url, options);
}

/**
 * Gets all video / rip objects from siivagunnerdatabase.net.
 * This will fail if the user doesn't have permission.
 *
 * @returns {Array[Object]} Returns the response.
 */
function getFromVideoDb() {
  const url = "https://siivagunnerdatabase.net/api/rips/";
  const options = { headers: { Authorization: authToken } };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

/**
 * Posts video / rip objects to siivagunnerdatabase.net.
 * This will fail if the user doesn't have permission.
 *
 * @param {Object | Array[Object]} videos The video objects to post.
 * @param {Boolean} [updateExisting] Whether or not to update existing records, defaults to false.
 * @returns {Object} Returns the response.
 */
function postToVideoDb(videos, updateExisting) {
  // Convert to Array[]
  if (!Array.isArray(videos)) {
    videos = [videos];
  }

  const url = "https://siivagunnerdatabase.net/api/rips/";
  const channelId = getVideo(videos[0].id);

  // Set the required fields
  videos.forEach((video) => {
    video.channel = channelId;
    video.author = 2; // spreadsheet-bot
    video.visible = true;
  });

  return postUrlResponse(url, videos, updateExisting);
}

/**
 * Gets all channel objects from siivagunnerdatabase.net.
 * This will fail if the user doesn't have permission.
 *
 * @returns {Array[Object]} Returns the response.
 */
function getFromChannelDb() {
  const url = "https://siivagunnerdatabase.net/api/channels/";
  const options = { headers: { Authorization: authToken } };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

/**
 * Posts channel objects to siivagunnerdatabase.net.
 * This will fail if the user doesn't have permission.
 *
 * @param {Object | Array[Object]} channels The channel objects to post.
 * @param {Boolean} [updateExisting] Whether or not to update existing records, defaults to false.
 * @returns {Object} Returns the response.
 */
function postToChannelDb(channels, updateExisting) {
  // Convert to Array[]
  if (!Array.isArray(channels)) {
    channels = [channels];
  }

  const url = "https://siivagunnerdatabase.net/api/channels/";

  // Set the required fields
  channels.forEach((channel) => {
    channel.author = 2; // spreadsheet-bot
    channel.visible = true;
  });

  return postUrlResponse(url, channels, updateExisting);
}

/**
 * Gets the status of a YouTube video, playlist, or channel.
 *
 * @param {String} youtubeId The YouTube video, playlist, or channel ID.
 * @returns {String} Returns the status: "Public", "Unlisted", "Unavailable", "Private", or "Deleted".
 */
function getYouTubeStatus(youtubeId) {
  let url;

  if (youtubeId.length == 11) {
    url = 'https://www.youtube.com/watch?v=' + youtubeId;
  } else if (youtubeId.includes("PL")) {
    url = 'https://www.youtube.com/playlist?list=' + youtubeId;
  } else if (youtubeId.includes("UC")) {
    url = 'https://www.youtube.com/channel/' + youtubeId;
  } else {
    return null;
  }

  let youtubeStatus;

  if (youtubeId.length == 11) {
    const contentText = getUrlResponse(url).getContentText();

    if (contentText.includes('"isUnlisted":true')) {
      youtubeStatus = "Unlisted";
    } else if (contentText.includes('"status":"OK"')) {
      youtubeStatus = "Public";
    } else if (contentText.includes('"This video is private."')) {
      youtubeStatus = "Private";
    } else if (contentText.includes('"status":"ERROR"')) {
      youtubeStatus = "Deleted";
    } else if (contentText.includes('"status":"UNPLAYABLE"')) {
      youtubeStatus = "Unavailable";
    }
  } else {
    const responseCode = getUrlResponse(url, true).getResponseCode();

    if (responseCode == 200) {
      youtubeStatus = "Public";
    } else if (responseCode == 403) {
      youtubeStatus = "Private";
    } else if (responseCode == 404) {
      youtubeStatus = "Deleted";
    } else {
      logEvent("HTTP " + responseCode + ": " + url);
    }
  }

  return youtubeStatus;
}

/**
 * Gets the status of a Fandom wiki page.
 *
 * @param {String} wikiName The name of the wiki.
 * @param {String} pageName The name of the wiki page.
 * @returns {String} Returns the status: "Documented" or "Undocumented".
 */
function getWikiStatus(wikiName, pageName) {
  const url = "https://" + wikiName + ".fandom.com/wiki/" + encodeFandomPageName(pageName);
  const statusCode = getUrlResponse(url, true).getResponseCode();
  let wikiStatus;

  if (statusCode == 200) {
    wikiStatus = "Documented";
  } else if (statusCode == 404) {
    wikiStatus = "Undocumented";
  }

  return wikiStatus;
}

/**
 * Gets the names of all members of a Fandom wiki category.
 *
 * @param {String} wikiName The name of the wiki.
 * @param {String} categoryName The name of the wiki category.
 * @returns {Array[String]} Returns all category member names.
 */
function getCategoryMembers(wikiName, categoryName) {
  let categoryMembers = [];
  let cmcontinue = "";

  while (cmcontinue != null) {
    const params = {
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:" + encodeURIComponent(categoryName),
      cmlimit: "500",
      cmcontinue: encodeURIComponent(cmcontinue),
      format: "json"
    };

    let url = "https://" + wikiName + ".fandom.com/api.php?"; 

    Object.keys(params).forEach((key) => {
      url += "&" + key + "=" + params[key];
    });

    try {
      const contentText = getUrlResponse(url).getContentText();
      const json = JSON.parse(contentText);
      categoryMembers = categoryMembers.concat(json.query.categorymembers);
      cmcontinue = json.continue ? json.continue.cmcontinue : null;
    } catch (e) {
      Logger.log(e);
    }
  }

  return categoryMembers.map((categoryMember) => {
    return categoryMember.title;
  });
}
