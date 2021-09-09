// Table of Contents
// 1. General
// 2. Sheets
// 3. YouTube
// 4. Fandom

///////////////////////
// General Utilities //
///////////////////////

// Takes [String | Date] date
// Gets the date in the format "yyyy-MM-dd   HH:mm:ss"
// Returns Date
function getFormattedDate(date) {
  return Utilities.formatDate(new Date(date), "UTC", "yyyy-MM-dd   HH:mm:ss");
}

// TODO - use Utilities.formatDate()
// Takes String length
// Gets the length in the format "HH:mm:ss"
// Returns String
function getFormattedLength(length) {
  for (var i = 0; i < length.length; i++) {
    if (length.charAt(i) == "T" && length.charAt(i + 2) == "S")
      length = length.replace("PT", "0:0");
    else if (length.charAt(i) == "T" && length.charAt(i + 3) == "S")
      length = length.replace("PT", "0:");
    else if (length.charAt(i) == "M" && length.charAt(i + 2) == "S")
      length = length.replace("M", ":0");
    if (length.charAt(i) == "H" && length.charAt(i + 2) == "M")
      length = length.replace("H", ":0");
  }

  if (length.indexOf("S") == -1)
    length += "00";

  length = length.replace("PT", "").replace("H", ":").replace("M", ":").replace("S", "");

  return length;
}

// Takes String videoId
// Gets a sheet hyperlink to a YouTube video URL
// Returns String
function getYouTubeHyperlink(videoId) {
  return '=HYPERLINK("https://www.youtube.com/watch?v=' + videoId + '", "' + videoId + '")';
}

// Takes String pageName, String wikiName
// Gets a sheet hyperlink to a Fandom page URL
// Returns String
function getFandomHyperlink(pageName, wikiName) {
  var wikiUrl = "https://" + wikiName + ".fandom.com/wiki/";
  pageName = pageName.replace(/Reupload: /g, "").replace(/Reup: /g, "");
  var simplePageName = pageName.replace(/"/g, '""').replace(/ \(GiIvaSunner\)/g, "");
  var encodedPageName = encodeFandomPageName(pageName);
  return '=HYPERLINK("' + wikiUrl + encodedPageName + '", "' + simplePageName + '")';
}

// Takes String pageName
// Gets an encoded page name for a Fandom page URL
// Returns String
function encodeFandomPageName(pageName) {
  pageName = pageName.replace(/\[/g, '(');
  pageName = pageName.replace(/\]/g, ')');
  pageName = pageName.replace(/\{/g, '(');
  pageName = pageName.replace(/\}/g, ')');
  pageName = pageName.replace(/#/g, '');
  pageName = pageName.replace(/\​\|\​_/g, 'L');
  pageName = pageName.replace(/\|/g, '');
  pageName = pageName.replace(/Nigga/g, 'N----');
  return encodeURIComponent(pageName);
}




///////////////////////
// YouTube Utilities //
///////////////////////

// Takes String videoId
// Gets the JSON data from a YouTube video
// Returns JSON
function getVideo(videoId) {
  return YouTube.Videos.list('snippet,contentDetails,statistics',{id: videoId}).items[0];
}

// Takes String channelId
// Gets the JSON data from a YouTube channel
// Returns JSON
function getChannel(channelId) {
  return YouTube.Channels.list('snippet,statistics', {id: channelId}).items[0];
}

// Takes String channelId
// Gets the JSON data from a YouTube channel's uploads
// Returns Array[JSON]
function getChannelUploads(channelId) {
  var channel = YouTube.Channels.list('contentDetails', {id: channelId}).items[0];
  var uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
  return getPlaylistItems(uploadsPlaylistId);
}

// Takes String playlistId
// Gets the JSON data from videos in a YouTube playlist
// Returns Array[JSON]
function getPlaylistItems(playlistId) {
  var playlistItems = [];
  var nextPageToken = "";

  while (nextPageToken != null) {
    var playlistResponse = YouTube.PlaylistItems.list('snippet', {playlistId: playlistId, maxResults: 50, pageToken: nextPageToken});
    playlistResponse.items.forEach(function(item) {playlistItems.push(item)});
    nextPageToken = playlistResponse.nextPageToken;
  }

  return playlistItems;
}

// Takes String videoId, String playlistId
// Removes a video from a YouTube playlist
// Returns null
function removeFromPlaylist(videoId, playlistId) {
  var playlist = YouTube.PlaylistItems.list('snippet', {playlistId: playlistId, videoId: videoId});
  var deletionId = playlist.items[0].id;
  YouTube.PlaylistItems.remove(deletionId);
}

// Takes String videoId, String playlistId
// Adds a video to a YouTube playlist
// Returns null
function addToPlaylist(videoId, playlistId) {
  YouTube.PlaylistItems.insert({snippet: {playlistId: playlistId, resourceId: {kind: "youtube#video", videoId: videoId}}}, "snippet");
}




//////////////////////
// Sheets Utilities //
//////////////////////

// Takes Sheet sheet, Integer column, Boolean ascending
// Sorts the given range of the spreadsheet
// Returns null
function sortRange(sheet, column, ascending) {
  ascending = ascending ? true : false;
  sheet.getDataRange().sort({column: column, ascending: ascending});
}




//////////////////////
// Fandom Utilities //
//////////////////////

// Takes String wikiName, String categoryName
// Gets the JSON data from members of a fandom wiki category 
// Returns Array[JSON]
function getCategoryMembers(wikiName, categoryName) {
  var categoryMembers = [];
  var cmcontinue = "";

  while (cmcontinue != null) {
    var url = "https://" + wikiName + ".fandom.com/api.php?"; 
    var params = {
      action: "query",
      list: "categorymembers",
      cmtitle: "Category:" + encodeURIComponent(categoryName),
      cmlimit: "500",
      cmcontinue: encodeURIComponent(cmcontinue),
      format: "json"
    };

    Object.keys(params).forEach(function(key) {url += "&" + key + "=" + params[key]});

    try {
      var response = UrlFetchApp.fetch(url);
      var json = JSON.parse(response.getContentText());
      categoryMembers = categoryMembers.concat(json.query.categorymembers);
      cmcontinue = json.continue ? json.continue.cmcontinue : null;
    }
    catch (error) {
      Logger.log(error);
    }
  }

  return categoryMembers;
}
