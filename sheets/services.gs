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

    /**
     * Get the SiIvaGunner Channels spreadsheet.
     * return {WrapperSpreadsheet} The spreadsheet object.
     */
    getChannelSpreadsheet() {
      const spreadsheetId = (
        settings().isDevModeEnabled() === true
        ? "1EDz_beMzXpxv8CpRhEu_GhcYCbT6EOP4JBDw93XoGdU" // Copy of SiIvaGunner Channels spreadsheet
        : "16PLJOqdZOdLXguKmUlUwZfu-1rVXzuJLHbY18BUSOAw" // SiIvaGunner Channels spreadsheet
      )
      return super.getById(spreadsheetId)
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
