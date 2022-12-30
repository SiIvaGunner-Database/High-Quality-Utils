let SpreadsheetService

/**
 * Service class for spreadsheets.
 * @extends CommonService
 * @return {Class} The service class.
 */
function SpreadsheetService_() {
  if (SpreadsheetService === undefined) SpreadsheetService = class SpreadsheetService extends CommonService_() {
    /**
     * Create a spreadsheet service.
     */
    constructor() {
      super(WrapperSpreadsheet_(), "spreadsheets")
    }
  }

  return SpreadsheetService
}

let theSpreadsheetService

/**
 * Get the spreadsheet service.
 * return {SpreadsheetService} The service object.
 */
function spreadsheets() {
  if (theSpreadsheetService === undefined) {
    theSpreadsheetService = new (SpreadsheetService_())()
  }

  return theSpreadsheetService
}
