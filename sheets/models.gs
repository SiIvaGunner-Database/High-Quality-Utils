let WrapperSpreadsheet

/**
 * Model class representing a spreadsheet.
 * @return {Class} The model class.
 */
function WrapperSpreadsheet_() {
  if (WrapperSpreadsheet === undefined) WrapperSpreadsheet = class WrapperSpreadsheet extends CommonModel_() {
    /**
     * Create a spreadsheet object.
     * @param {Spreadsheet} spreadsheetObject - The Google Sheets object.
     * @param {Object} databaseObject - The database metadata.
     */
    constructor(spreadsheetObject, databaseObject) {
      super(spreadsheetObject, databaseObject, spreadsheets())
    }

    /**
     * Get a child sheet from the spreadsheet.
     * @return {WrapperSheet} The sheet object.
     */
    getSheet(sheetName) {
      const sheet = this.getSpreadsheetObject().getSheetByName(sheetName)
      return new (WrapperSheet_())(this, sheet)
    }
  }

  return WrapperSpreadsheet
}


let WrapperSheet

/**
 * Model class representing a sheet inside a spreadsheet.
 * This is just a wrapper class for the Sheet class provided in Apps Script.
 * There is no matching object in the web application database.
 * @return {Class} The model class.
 */
function WrapperSheet_() {
  if (WrapperSheet === undefined) WrapperSheet = class WrapperSheet {
    /**
     * Creates a sheet object.
     * @param {WrapperSpreadsheet} parentSpreadsheet - The parent object.
     * @param {Sheet} sheetObject - The Google Sheets object.
     */
    constructor(parentSpreadsheet, sheetObject) {
      this._parentSpreadsheet = parentSpreadsheet
      this._sheetObject = sheetObject
    }

    /**
     * Get the base sheet object.
     * @return {Sheet} The base object.
     */
    getBaseObject() {
      return this._sheetObject
    }

    /**
     * Get the parent spreadsheet.
     * @return {WrapperSpreadsheet} The parent object.
     */
    getSpreadsheet() {
      return this._parentSpreadsheet
    }

    /**
     * Get all data values from a spreadsheet, ignoring the header row.
     * @param {String} [dataType] - The type of object to return from the values.
     * @return {Array[Array[Object]]} The values.
     */
    getValues(dataType) {
      // TODO rewrite this
      const data = this.getBaseSheet().getDataRange().getValues()
      data.shift() // Ignore the header row

      if (dataType) {
        switch (dataType.toLowerCase()) {
          case "video":
          case "videos":
            data.forEach((row, index) => {
              row[6] = row[6].toString().replace(/NEWLINE/g, "\n") // video.description
              data[index] = new Video(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10])
            })
            break
          case "playlist":
          case "playlists":
            data.forEach((row, index) => {
              data[index] = new Playlist(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
            })
            break
          case "channel":
          case "channels":
            data.forEach((row, index) => {
              row[5] = row[5].toString().replace(/NEWLINE/g, "\n") // channel.description
              data[index] = new Channel(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8])
            })
            break
          case "change":
          case "changes":
            data.forEach((row, index) => {
              data[index] = new Change(row[0], row[1], row[2], row[3])
            })
            break
        }
      }

      return data
    }

    /**
     * Insert a range of data into a spreadsheet.
     * @param {Object | Array[Object]} data - The data to insert.
     */
    addValues(data) {
      // TODO rewrite this
      // Convert to Array[]
      if (!Array.isArray(data)) {
        data = [data]
      }

      const sheet = this.getBaseSheet()
      sheet.insertRowsBefore(2, data.length)
      this.updateInSheet(data, 2)
    }

    /**
     * Update a range of data in a spreadsheet.
     * @param {Object | Array[Object]} data - The data to insert.
     * @param {Integer} row - The row to update.
     */
    updateValues(data, row) {
      // TODO rewrite this
      // Convert to Array[]
      if (!Array.isArray(data)) {
        data = [data]
      }

      // Convert to Array[Array[]]
      data.forEach((object, index) => {
        switch(object.constructor.name) {
          case "Video":
          case "Playlist":
          case "Channel":
            object.id = formatYouTubeHyperlink(object.id)
            object.description = object.description.toString().replace(/\n/g, "NEWLINE")
            break
        }

        // Convert to array of object values
        data[index] = Object.values(object)
      })

      const sheet = this.getBaseSheet()
      sheet.getRange(row, 1, data.length, sheet.getLastColumn()).setValues(data)
    }

    /**
     * Sort the given spreadsheet, ignoring the header row.
     * @param {Integer} column - The column number.
     * @param {Boolean} [ascending] - Whether or not to sort in ascending order, defaults to false.
     */
    sort(column, ascending) {
      // TODO rewrite this
      const sheet = this.getBaseSheet()
      ascending = (ascending === true ? true : false)
      // Sort everything but the header row
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).sort({column: column, ascending: ascending})
    }

    /**
     * Log a change to the changelog spreadsheets.
     * @param {String} id - The YouTube ID.
     * @param {String} type - The type of change.
     * @param {String} oldValue - The old value.
     * @param {String} newValue - The new value.
     */
    logChange_(id, type, oldValue, newValue) {
      // TODO rewrite this
      const sheet = this.getBaseSheet()
      const change = new Change(formatYouTubeHyperlink(id), type, oldValue, newValue, new Date())
      this.addToSheet(change)
      const changelogSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Changelog")
      changelogSheet.addToSheet(changelogSheet, change)
    }
  }

  return WrapperSheet
}
