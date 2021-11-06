/**
 * Runs all function tests.
 */
function runTests() {

  const date = new Date();
  const length = "PT1H1M1S";
  const videoId = "NzoneDE0A2o"; // https://www.youtube.com/watch?v=NzoneDE0A2o
  const wikiName = "siivagunner"; // https://siivagunner.fandom.com/wiki/SiIvaGunner_Wiki
  const pageName = "The Inn - Fire Emblem"; // https://siivagunner.fandom.com/wiki/The_Inn_-_Fire_Emblem
  const channelId = "UCYGz7FZImRL8oI68pD7NoKg"; // https://www.youtube.com/c/SiIvaGunner2
  const playlistId = "PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F"; // https://www.youtube.com/playlist?list=PLn8P5M1uNQk5_q_y1BVxgP68xhKQ2eM3F
  const sheet = SpreadsheetApp.openById("11XxOGk3IVJdiOs3nFzcdFxhedXep4_JLRSXTs8E-2v8").getSheetByName("Tests"); // https://docs.google.com/spreadsheets/d/11XxOGk3IVJdiOs3nFzcdFxhedXep4_JLRSXTs8E-2v8
  const video = new Video("id", "title", "wiki status", "yt status", "upload date", "leng", "desc", "views", "likes", "dislikes", "comments");
  const column = 3;
  const row = 9;
  const categoryName = "Rips with sentence mixing"; // https://siivagunner.fandom.com/wiki/Category:Rips_with_sentence_mixing

  Logger.log( "Testing general utilities" );
  Logger.log( formatDate(date) );
  Logger.log( formatLength(length) );
  Logger.log( formatYouTubeHyperlink(videoId) );
  Logger.log( formatFandomHyperlink(pageName, wikiName) );
  Logger.log( encodeFandomPageName(pageName) );

  Logger.log( "Testing YouTube utilities" );
  Logger.log( getVideo(videoId) );
  Logger.log( getChannel(channelId) );
  Logger.log( getChannelUploads(channelId) );
  Logger.log( getPlaylistItems(playlistId) );
  Logger.log( addToPlaylist(playlistId, videoId) );
  Logger.log( removeFromPlaylist(playlistId, videoId) );

  Logger.log( "Testing sheets utilities" );
  Logger.log( getSheetValues(sheet) );
  Logger.log( addToSheet(sheet, video) );
  Logger.log( updateInSheet(sheet, video, row) );
  Logger.log( sortSheet(sheet, column) );

  Logger.log( "Testing fetch utilities" );
  Logger.log( getCategoryMembers(wikiName, categoryName) );

}
