function runTests() {
  var date = new Date();
  var length = "PT1H1M1S";
  var videoId = "NzoneDE0A2o";
  var wikiName = "siivagunner";
  var pageName = "The Inn - Fire Emblem";
  var channelId = "UCYGz7FZImRL8oI68pD7NoKg";
  var playlistId = "PLn8P5M1uNQk7hJWh8jPlpbhvvxex_QfI5";
  var sheet = SpreadsheetApp.openById("11XxOGk3IVJdiOs3nFzcdFxhedXep4_JLRSXTs8E-2v8").getSheetByName("Testing");
  var video = ["aaa", "aaa", "aaa", "aaa", "aaa", "aaa", "aaa", "aaa", "aaa", "aaa"];
  var column = 3;
  var categoryName = "Rips with sentence mixing";

  var formattedDate = getFormattedDate(date);
  Logger.log(formattedDate);

  var formattedLength = getFormattedLength(length);
  Logger.log(formattedLength);

  var youtubeHyperlink = getYouTubeHyperlink(videoId);
  Logger.log(youtubeHyperlink);

  var fandomHyperlink = getFandomHyperlink(pageName, wikiName);
  Logger.log(fandomHyperlink);

  var pageName = encodeFandomPageName(pageName);
  Logger.log(pageName);

  var video = getVideo(videoId);
  Logger.log(video);

  var channel = getChannel(channelId);
  Logger.log(channel);

  var channelUploads = getChannelUploads(channelId);
  Logger.log(channelUploads);

  var playlistItems = getPlaylistItems(playlistId);
  Logger.log(playlistItems);

  var remove = removeFromPlaylist(videoId, playlistId);
  Logger.log(remove);

  var add = addToPlaylist(videoId, playlistId);
  Logger.log(add);

  var insert = insertRow(sheet, video);
  Logger.log(insert);

  var range = getRange(sheet);
  Logger.log(range);

  var sort = sortRange(sheet, column);
  Logger.log(sort);

  var categoryMembers = getCategoryMembers(wikiName, categoryName);
  Logger.log(categoryMembers);
}
