let SpreadsheetService

/**
 * Service class for spreadsheets.
 * @extends CachedService
 * @return {Class} The service class.
 */
function SpreadsheetService_() {
  if (SpreadsheetService === undefined) SpreadsheetService = class SpreadsheetService extends CachedService_() {
    /**
     * Create a sheet service.
     */
    constructor() {
      super()
    }

    getById(spreadsheetId) {
      
    }

    getAll() {

    }

    updateAll() {
      
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
