let WrapperSpreadsheet

/**
 * Model class representing a spreadsheet.
 * @extends CommonModel
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
      const sheet = this.getBaseObject().getSheetByName(sheetName)
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
     * Create a sheet object.
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
     * Get all data values from a sheet, excluding the header row.
     * @return {Array[Array[Object]]} The values.
     */
    getValues() {
      const data = this.getBaseObject().getDataRange().getValues()
      data.shift() // Remove the header row
      return data
    }

    /**
     * Insert a range of data into a sheet.
     * @param {Object | Array[CommonModel | Object]} data - The data to insert.
     */
    insertValues(data) {
      // Convert to Array[]
      data = Object.values(data)
      this.getBaseObject().insertRowsBefore(2, data.length)
      this.updateValues(data, 2)
    }

    /**
     * Update a range of data in a sheet.
     * @param {Object | Array[CommonModel | Object]} data - The data to insert.
     * @param {Number} row - The row to update.
     */
    updateValues(data, row) {
      // Convert to Array[Array[]]
      data = Object.values(data).map(object => {
        if (typeof object === CommonModel_()) {
          // Get the values for keys listed in the column config
          const columns = object.getColumnConfig().columns
          return Object.values(columns).map(column => object.getDatabaseObject()[column])
        } else {
          return Object.values(object)
        }
      })

      // Update the data range
      this.getBaseObject().getRange(row, 1, data.length, sheet.getLastColumn()).setValues(data)
    }

    /**
     * Sort the given sheet, excluding the header row.
     * @param {Number} column - The column number.
     * @param {Boolean} [ascending] - Whether or not to sort in ascending order. Defaults to true.
     */
    sort(column, ascending = true) {
      const sheet = this.getBaseObject()
      sheet.setFrozenRows(1) // Freeze the header row
      sheet.sort(column, ascending)
    }
  }

  return WrapperSheet
}
