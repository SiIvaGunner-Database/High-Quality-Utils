/**
 * Model class for YouTube videos.
 */
class SiivaSheet  {

  /**
   * Creates a sheet object.
   */
  constructor() {
  }  

  /**
   * Gets all data values from a spreadsheet, ignoring the header row.
   *
   * @param {Sheet} sheet The sheet object.
   * @param {String} [dataType] The type of object to return from the values.
   * @returns {Array[Array[Object]]} Returns the values.
   */
  getSheetValues(sheet, dataType) {
    const data = sheet.getDataRange().getValues();
    data.shift(); // Ignore the header row

    if (dataType) {
      switch (dataType.toLowerCase()) {
        case "video":
        case "videos":
          data.forEach((row, index) => {
            row[6] = row[6].toString().replace(/NEWLINE/g, "\n"); // video.description
            data[index] = new Video(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10]);
          });
          break;
        case "playlist":
        case "playlists":
          data.forEach((row, index) => {
            data[index] = new Playlist(row[0], row[1], row[2], row[3], row[4], row[5], row[6]);
          });
          break;
        case "channel":
        case "channels":
          data.forEach((row, index) => {
            row[5] = row[5].toString().replace(/NEWLINE/g, "\n"); // channel.description
            data[index] = new Channel(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]);
          });
          break;
        case "change":
        case "changes":
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
  addToSheet(sheet, data) {
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
  updateInSheet(sheet, data, row) {
    // Convert to Array[]
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Convert to Array[Array[]]
    data.forEach((object, index) => {
      switch(object.constructor.name) {
        case "Video":
        case "Playlist":
        case "Channel":
          object.id = formatYouTubeHyperlink(object.id);
          object.description = object.description.toString().replace(/\n/g, "NEWLINE");
          break;
      }

      // Convert to array of object values
      data[index] = Object.values(object);
    });

    sheet.getRange(row, 1, data.length, sheet.getLastColumn()).setValues(data);
  }

  /**
   * Sorts the given spreadsheet, ignoring the header row.
   *
   * @param {Sheet} sheet The sheet object.
   * @param {Integer} column The column number.
   * @param {Boolean} [ascending] Whether or not to sort in ascending order, defaults to false.
   */
  sortSheet(sheet, column, ascending) {
    ascending = ascending ? true : false;
    // Sort everything but the header row
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort({column: column, ascending: ascending});
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
  logChange(sheet, id, type, oldValue, newValue) {
    const change = new Change(formatYouTubeHyperlink(id), type, oldValue, newValue, new Date());
    addToSheet(sheet, change);
    const changelogSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Changelog");
    addToSheet(changelogSheet, change);
  }

}
