let SpreadsheetService

/**
 * Service class for spreadsheets.
 * @extends CachedService
 * @return {Class} The service class.
 */
function SpreadsheetService_() {
  if (SpreadsheetService === undefined) SpreadsheetService = class SpreadsheetService extends CommonService_() {
    /**
     * Create a spreadsheet service.
     */
    constructor() {
      super(WrapperSpreadsheet_(), "sheets")
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
