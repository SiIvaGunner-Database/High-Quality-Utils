/**
 * Service class for spreadsheets.
 */
class SpreadsheetService {

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

/**
 * The constant playlist service.
 */
const spreadsheetService = new SpreadsheetService()

/**
 * get the spreadsheet service instance.
 * @return {SpreadsheetService} The spreadsheet service.
 */
function getSpreadsheetService() {
  return spreadsheetService
}
