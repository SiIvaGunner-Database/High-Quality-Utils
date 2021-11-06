// Table of Contents
// 1. General
// 2. YouTube
// 3. Sheets
// 4. Fetch

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
 * Returns a sheet hyperlink to a YouTube video URL.
 *
 * @param {String} videoId The YouTube video ID.
 * @returns {String} Returns the formatted hyperlink.
 */
function formatYouTubeHyperlink(videoId) {
  return '=HYPERLINK("https://www.youtube.com/watch?v=' + videoId + '", "' + videoId + '")';
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
 * Gets the JSON data from a YouTube video.
 *
 * @param {String} videoId The YouTube video ID.
 * @returns {Object} Returns the video object.
 */
function getVideo(videoId) {
  try {
    return YouTube.Videos.list("snippet, contentDetails, statistics", {id: videoId}).items[0];
  } catch(e) {
    Logger.log(e);
    return null;
  }
}

/**
 * Gets the JSON data from a YouTube channel.
 *
 * @param {String} channelId The YouTube channel ID.
 * @returns {Object} Returns the channel object.
 */
function getChannel(channelId) {
  try {
    return YouTube.Channels.list("snippet, statistics", {id: channelId}).items[0];
  } catch(e) {
    Logger.log(e);
    return null;
  }
}

/**
 * Gets the JSON data from a YouTube channel's uploads.
 *
 * @param {String} channelId The YouTube channel ID.
 * @returns {Array[Object]} Returns the video objects.
 */
function getChannelUploads(channelId) {
  try {
    const channel = YouTube.Channels.list("contentDetails", {id: channelId}).items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    return getPlaylistItems(uploadsPlaylistId);
  } catch(e) {
    Logger.log(e);
    return null;
  }
}

/**
 * Gets the JSON data from videos in a YouTube playlist.
 *
 * @param {String} playlistId The YouTube playlist ID.
 * @returns {Array[Object]} Returns the video objects.
 */
function getPlaylistItems(playlistId) {
  try {
    let playlistItems = [];
    let nextPageToken = "";

    while (nextPageToken != null) {
      const playlist = YouTube.PlaylistItems.list("snippet", {playlistId: playlistId, maxResults: 50, pageToken: nextPageToken});
      playlist.items.forEach(function(item) {playlistItems.push(getVideo(item.snippet.resourceId))});
      nextPageToken = playlist.nextPageToken;
    }

    return playlistItems;
  } catch(e) {
    Logger.log(e);
    return null;
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
    return null;
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
    return null;
  }
}




//////////////////////
// Sheets Utilities //
//////////////////////

/**
 * Gets all data values from a spreadsheet, ignoring the header row.
 *
 * @param {Sheet} sheet The spreadsheet object.
 * @returns {Array[Array[Object]]} Returns the values.
 */
function getSheetValues(sheet) {
  let data = sheet.getDataRange().getValues();
  data.shift(); // Ignore the header row
  return data;
}

/**
 * Inserts a range of data into a spreadsheet.
 *
 * @param {Sheet} sheet The spreadsheet object.
 * @param {Array[Object] | Object} data The data to insert.
 */
function addToSheet(sheet, data) {
  sheet.insertRowAfter(sheet.getLastRow());
  updateInSheet(sheet, data, sheet.getLastRow());
}

/**
 * Updates a range of data in a spreadsheet.
 *
 * @param {Sheet} sheet The spreadsheet object.
 * @param {Array[Object] | Object} data The data to insert.
 * @param {Integer} row The row to update.
 */
function updateInSheet(sheet, data, row) {
  let values = [];

  for (let index in data) {
    values.push(data[index]);
  }

  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setValues([values]);
}

/**
 * Sorts the given spreadsheet, ignoring the header row.
 *
 * @param {Sheet} sheet The spreadsheet object.
 * @param {Integer} column The column number.
 * @param {Boolean} [ascending] True if ascending, defaults to false.
 */
function sortSheet(sheet, column, ascending) {
  ascending = ascending ? true : false;
  // Sort everything but the header row
  sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort({column: column, ascending: ascending});
}




/////////////////////
// Fetch Utilities //
/////////////////////

/**
 * Gets the JSON data from members of a fandom wiki category .
 *
 * @param {String} wikiName The name of the wiki.
 * @param {String} categoryName The name of the wiki category.
 * @returns {Array[Object]} Returns the category member objects.
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
      const request = UrlFetchApp.fetch(url);
      const json = JSON.parse(request.getContentText());
      categoryMembers = categoryMembers.concat(json.query.categorymembers);
      cmcontinue = json.continue ? json.continue.cmcontinue : null;
    } catch (e) {
      Logger.log(e);
    }
  }

  return categoryMembers;
}
