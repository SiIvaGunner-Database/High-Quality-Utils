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
      const sheet = super.getOriginalObject().getSheetByName(sheetName)
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
      this._rowHeight = 21 // Force the default height of 21 pixels 
    }

    /**
     * Get the base sheet object.
     * @return {Sheet} The base object.
     */
    getOriginalObject() {
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
      const data = this.getOriginalObject().getDataRange().getValues()
      data.shift() // Remove the header row
      return data
    }

    /**
     * Get the row index of the first cell containing a specified value.
     * @param {Object} findText - The value to search for.
     * @param {Number} [column] - A column index to search through. Defaults to 1.
     * @return {Number} The row index of the cell.
     */
    getRowIndexOfValue(findText, column = 1) {
      const sheet = this.getOriginalObject()
      const numberOfRows = sheet.getLastRow() - 1
      const searchRange = sheet.getRange(2, column, numberOfRows)
      return searchRange.createTextFinder(findText).findNext().getRowIndex()
    }

    /**
     * Create a new sheet to become the original object of this instance.
     * @param {String} sheetName - The name of the new sheet.
     */
    create(sheetName) {
      this._sheetObject = videoSpreadsheet.getOriginalObject().insertSheet(sheetName)
    }

    /**
     * Insert a range of data into a sheet.
     * @param {Array[Array[Object]]} data - The data to insert.
     * @param {Array[Array[Object]]} [data] - An optional row to insert from, defaulting to 2.
     */
    insertValues(data, row = 2) {
      if (data.length === 0) {
        return
      }

      this.getOriginalObject().insertRowsBefore(row, data.length)
      this.updateValues(data, row)
    }

    /**
     * Update a range of data in a sheet.
     * @param {Array[Array[Object]]} data - The data to insert.
     * @param {Number} [row] - An optional row number to update from. Defaults to 2.
     * @param {Number} [column] - An optional column number to update from. Defaults to 1.
     */
    updateValues(data, row = 2, column = 1) {
      const sheet = this.getOriginalObject()
      const numberOfRows = data.length
      const numberOfColumns = data[0].length
      sheet.setRowHeightsForced(row, numberOfRows, this._rowHeight)
      sheet.getRange(row, column, numberOfRows, numberOfColumns).setValues(data)
    }

    /**
     * Sort the given sheet, excluding the header row.
     * @param {Number} column - The column number.
     * @param {Boolean} [ascending] - Whether or not to sort in ascending order. Defaults to true.
     */
    sort(column, ascending = true) {
      const sheet = this.getOriginalObject()
      const firstRow = 1
      sheet.setFrozenRows(firstRow) // Freeze the header row
      sheet.setRowHeightsForced(firstRow, sheet.getLastRow(), this._rowHeight)
      sheet.sort(column, ascending)
    }

    /**
     * Format a sheet, updating the header row, cell value alignment, and date formatting.
     * The sheet can but does not have to be empty.
     * @param {Sheet} sheet - The sheet to format.
     * @param {Array[String]} columnLabels - A list of column labels to put into the top header row.
     * @param {Array[Number]} [dateColumnIndexes] - An optional list of columns containing date values.
     * @param {Array[Number]} [hiddenColumnIndexes] - An optional list of columns to hide from view.
     */
    format(columnLabels, dateColumnIndexes, hiddenColumnIndexes) {
      const sheet = this.getOriginalObject()
      const firstRow = 1
      const lastRow = sheet.getLastRow()

      // Add the column labels and remove empty columns and rows
      sheet.getRange(firstRow, 1, 1, columnLabels.length).setValues(columnLabels)
      sheet.deleteColumns(columnLabels.length + 1, sheet.getLastColumn() - columnLabels.length)
      const columnValues = sheet.getRange("A:A").getValues()
      let firstEmptyRow = columnValues.findIndex(row => row[0] === "") + 1

      if (firstEmptyRow > -1) {
        if (firstEmptyRow <= 2) {
          firstEmptyRow = 3
        }

        sheet.deleteRows(firstEmptyRow, lastRow - firstEmptyRow + 1)
      }

      // Freeze and bold the header row
      sheet.setFrozenRows(firstRow)
      sheet.getDataRange().setFontWeight("bold")

      // Enforce height and left alignment on all cells
      sheet.setRowHeightsForced(firstRow, lastRow, this._rowHeight)
      sheet.getDataRange().setHorizontalAlignment("left")

      // Format date columns and hide extra columns
      dateColumnIndexes.forEach(column => sheet.getRange(firstRow, column, lastRow).setNumberFormat("yyyy-MM-dd   HH:mm:ss"))
      hiddenColumnIndexes.forEach(column => sheet.hideColumn(column))
    }
  }

  return WrapperSheet
}

function test() {
  console.log(SpreadsheetApp.openById("1uRgcmhoRNBPabK0JnTpjUxxaickBH0iGCXRrSDhkxO0").getSheetByName("Index").getRange("B:B").getValues())
  // console.log(spreadsheets().getById("1uRgcmhoRNBPabK0JnTpjUxxaickBH0iGCXRrSDhkxO0").getSheet("Index").getRowIndexOfValue("", 2))
}
