/**
 * Runs all function tests.
 */
function runTests() {
  const date = new Date();
  const length = "PT1H1M1S";
  const videoId = "NzoneDE0A2o";
  const wikiName = "siivagunner";
  const pageName = "The Inn - Fire Emblem";
  const channelId = "UCYGz7FZImRL8oI68pD7NoKg";
  const playlistId = "PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F";
  const sheet = SpreadsheetApp.openById("11XxOGk3IVJdiOs3nFzcdFxhedXep4_JLRSXTs8E-2v8").getSheetByName("Tests");
  const video = new Video("id", "title", "wiki status", "yt status", "upload date", "leng", "desc", "views", "likes", "dislikes", "comments");
  const column = 3;
  const row = 9;
  const message = "This is a test!";
  const url = "https://siivagunnerdatabase.net/api/";
  const data = { key: "value" };
  const channel = new Channel("id", "name", "wiki", "yt status", "join date", "desc", "videos", "subs", "views");
  const categoryName = "Rips with sentence mixing";

  Logger.log( "Testing general utilities" );
  Logger.log( formatDate(date) );
  Logger.log( formatLength(length) );
  Logger.log( formatYouTubeHyperlink(videoId) );
  Logger.log( formatFandomHyperlink(pageName, wikiName) );
  Logger.log( formatFandomPageName(pageName) );

  Logger.log( "Testing YouTube utilities" );
  Logger.log( getVideo(videoId) );
  Logger.log( getVideos([videoId, videoId]) );
  Logger.log( getPlaylist(playlistId) );
  Logger.log( getPlaylists([playlistId, playlistId]) );
  Logger.log( getChannel(channelId) );
  Logger.log( getChannels([channelId, channelId]) );
  Logger.log( getChannelUploads(channelId) );
  Logger.log( getPlaylistItems(playlistId) );
  Logger.log( addToPlaylist(playlistId, videoId) );
  Logger.log( removeFromPlaylist(playlistId, videoId) );

  Logger.log( "Testing Sheets utilities" );
  Logger.log( getSheetValues(sheet) );
  Logger.log( addToSheet(sheet, video) );
  Logger.log( updateInSheet(sheet, video, row) );
  Logger.log( sortSheet(sheet, column) );
  Logger.log( getAuthToken() );
  Logger.log( logEvent(message) );

  Logger.log( "Testing fetch utilities" );
  Logger.log( getUrlResponse(url) );
  Logger.log( postUrlResponse(url, data) );
  Logger.log( getFromVideoDb() );
  Logger.log( postToVideoDb(video) );
  Logger.log( getFromChannelDb() );
  Logger.log( postToChannelDb(channel) );
  Logger.log( getYouTubeStatus(videoId) );
  Logger.log( getWikiStatus(wikiName, pageName) );
  Logger.log( getCategoryMembers(wikiName, categoryName) );
}
