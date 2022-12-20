let CommonModel;

/**
 * Model class representing a database object.
 * @return {Class} The model class.
 */
function CommonModel_() {
  if (CommonModel === undefined) CommonModel = class CommonModel {
    /**
     * Create a database object.
     * @param {Object} baseObject - The base object (YouTube, Google Sheets, etc.).
     * @param {Object} databaseObject - The database metadata.
     * @param {Object} service - The related service object.
     */
    constructor(baseObject, databaseObject, service) {
      this._ogObject = baseObject
      this._dbObject = databaseObject
      this._service = service
    }

    /**
     * Get the base object ID.
     * @return {ID} The base object ID.
     */
    getId() {
      return this.getBaseObject().id
    }

    /**
     * Get the base object.
     * @return {Object} The base object.
     */
    getBaseObject() {
      return this._ogObject
    }

    /**
     * Get the database metadata.
     * @return {Object} The database metadata.
     */
    getDatabaseObject() {
      return this._dbObject
    }

    /**
     * Get a list of differences between the base object and the database object.
     * @return {Array[String]} An array of database object keys for any new values.
     */
    getChanges() {
      // TODO
      return []
    }

    /**
     * Get whether or not the base object has any differences from the database object.
     * @return {Boolean} True if there are any differences, else false.
     */
    hasChanges() {
      return this.getChanges().length > 0
    }

    /**
     * Update the database object and apply the changes to both the web application and Google Sheets.
     */
    update() {
      database().putData(service.getApiPath(), this.getDatabaseObject())
      this.logChanges_()
      // TODO update the sheet
    }

    /**
     * Log any changes to the console and spreadsheet logs.
     */
    logChanges_() {
      const changes = this.getChanges()

      changes.forEach(change => {
        cosole.log(change)
        // TODO log the change to a spreadsheet
      })
    }
  }

  return CommonModel;
}
