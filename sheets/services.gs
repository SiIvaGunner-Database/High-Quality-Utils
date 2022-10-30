let SpreadsheetService

/**
 * Service class for spreadsheets.
 * @return {Class} The service class.
 */
function SpreadsheetService_() {
  if (SpreadsheetService == undefined) SpreadsheetService = class SpreadsheetService {
    /**
     * Create a sheet service.
     */
    constructor() {
      this._cache = []
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
function spreadsheetService() {
  if (theSpreadsheetService == undefined) theSpreadsheetService = new SpreadsheetService_()

  return theSpreadsheetService
}
