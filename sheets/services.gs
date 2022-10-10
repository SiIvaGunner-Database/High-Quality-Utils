/**
 * Service class for Google Sheets.
 */
class SheetService {

  /**
   * Creates a new sheet service.
   */
  constructor() {
  }

  /**
   * Logs a message to the event log spreadsheet.
   *
   * @param {String} message The message to log.
   */
  logEvent(message) {
    const projectId = ScriptApp.getScriptId();
    const projectName = DriveApp.getFileById(projectId).getName();
    const date = new Date();
    const event = new Event(projectName, message, date);
    const eventSheet = SpreadsheetApp.openById("1_78uNwS1kcxru3PIstADhjvR3hn6rlc-yc4v4PkLoMU").getSheetByName("Events");
    addToSheet(eventSheet, event);
  }

}
