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
     * Create a new child sheet from the spreadsheet.
     * @param {String} sheetName - The name of the new sheet.
     * @return {WrapperSheet} The sheet object.
     */
    createSheet(sheetName) {
      const sheet = super.getOriginalObject().insertSheet(sheetName)
      return new (WrapperSheet_())(this, sheet)
    }

    /**
     * Check whether or not a sheet with the given name exists in the spreadsheet.
     * @param {String} sheetName - The name of the sheet.
     * @return {Boolean} True if a sheet exists, else false.
     */
    hasSheet(sheetName) {
      return super.getOriginalObject().getSheetByName(sheetName) !== null
    }

    /**
     * Get a child sheet from the spreadsheet.
     * @param {String} sheetName - The name of the sheet.
     * @return {WrapperSheet} The sheet object.
     */
    getSheet(sheetName) {
      const sheet = super.getOriginalObject().getSheetByName(sheetName)

      if (sheet === null) {
        throw new Error(`No sheet found with the name "${sheetName}" in spreadsheet "${super.getId()}"`)
      }

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
     * @param {String} [a1Notation] - An optional sheet range to get values from. Defaults to the full data range.
     * @return {Array[Array[Object]]} The values.
     */
    getValues(a1Notation) {
      let range

      if (a1Notation !== undefined) {
        range = this.getOriginalObject().getRange(a1Notation)
      } else {
        range = this.getOriginalObject().getDataRange()
      }

      const data = range.getValues()
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
     * Insert a range of data into a sheet.
     * @param {Array[Array[Object]]} data - The data to insert.
     * @param {Number} [row] - An optional row to insert from, defaulting to 2.
     * @param {Number} [column] - An optional column to insert from, defaulting to 1.
     * @return {WrapperSheet} The current object.
     */
    insertValues(data, row = 2, column = 1) {
      if (data.length === 0) {
        return
      }

      this.getOriginalObject().insertRowsBefore(row, data.length)
      this.updateValues(data, row, column)
      return this
    }

    /**
     * Update a range of data in a sheet.
     * @param {Array[Array[Object]]} data - The data to insert.
     * @param {Number} [row] - An optional row number to update from. Defaults to 2.
     * @param {Number} [column] - An optional column number to update from. Defaults to 1.
     * @return {WrapperSheet} The current object.
     */
    updateValues(data, row = 2, column = 1) {
      const sheet = this.getOriginalObject()
      const numberOfRows = data.length
      const numberOfColumns = data[0].length
      sheet.setRowHeightsForced(row, numberOfRows, this._rowHeight)
      sheet.getRange(row, column, numberOfRows, numberOfColumns).setValues(data)
      return this
    }

    /**
     * Sort the given sheet, excluding the header row.
     * @param {Number} column - The column number.
     * @param {Boolean} [ascending] - Whether or not to sort in ascending order. Defaults to true.
     * @return {WrapperSheet} The current object.
     */
    sort(column, ascending = true) {
      const sheet = this.getOriginalObject()
      const firstRow = 1
      sheet.setFrozenRows(firstRow) // Freeze the header row
      sheet.setRowHeightsForced(firstRow, sheet.getLastRow(), this._rowHeight)
      sheet.sort(column, ascending)
      return this
    }

    /**
     * Format a sheet, updating the header row, cell value alignment, and date formatting.
     * The sheet can but does not have to be empty.
     * @param {Sheet} sheet - The sheet to format.
     * @param {Array[String]} columnLabels - A list of column labels to put into the top header row.
     * @param {Array[Number]} [dateColumnIndexes] - An optional list of columns containing date values.
     * @param {Array[Number]} [hiddenColumnIndexes] - An optional list of columns to hide from view.
     * @return {WrapperSheet} The current object.
     */
    format(columnLabels, dateColumnIndexes, hiddenColumnIndexes) {
      const sheet = this.getOriginalObject()
      const firstRow = 1
      const lastRow = sheet.getLastRow()

      // Add the column labels
      sheet.getRange(firstRow, 1, 1, columnLabels.length).setValues([columnLabels])

      // Remove all columns after the labels
      if (sheet.getMaxColumns() > columnLabels.length) {
        sheet.deleteColumns(columnLabels.length + 1, sheet.getMaxColumns() - columnLabels.length);
      }

      // Remove all rows after the last row with data or after row 2 if all non-header rows are empty
      if (sheet.getMaxRows() > lastRow && sheet.getMaxRows() > 2) {
        const firstEmptyRow = (lastRow === 1 ? 3 : lastRow + 1)
        sheet.deleteRows(firstEmptyRow, sheet.getMaxRows() - firstEmptyRow + 1)
      }

      // Freeze and bold the header row
      sheet.setFrozenRows(firstRow)
      sheet.getRange("1:1").setFontWeight("bold")

      // Enforce height, left alignment, and no underlines on all cells
      sheet.setRowHeightsForced(firstRow, lastRow, this._rowHeight)
      sheet.getDataRange().setHorizontalAlignment("left").setFontLine("none")

      // Format and widen date columns
      dateColumnIndexes.forEach(column => {
        sheet.setColumnWidth(column, 150)
        sheet.getRange(firstRow, column, lastRow).setNumberFormat("yyyy-MM-dd   HH:mm:ss")
      })

      // Hide extra columns
      hiddenColumnIndexes.forEach(column => sheet.hideColumns(column))
      return this
    }
  }

  return WrapperSheet
}
