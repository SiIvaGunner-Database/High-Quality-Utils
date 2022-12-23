let CommonModel

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
     * @param {Object} [columnConfig] - The optional column map configuration for objects with corresponding sheets.
     */
    constructor(baseObject, databaseObject, service, columnConfig = { sortColumn: 1, columns: [] }) {
      this._ogObject = baseObject
      this._dbObject = databaseObject
      this._service = service
      this._columnConfig = columnConfig // TODO? consider moving column config to web app; it could make it easier to configure individual sheets
      this._changes
    }

    /**
     * Get the column configuration.
     * @return {Object} The column configuration.
     */
    getColumnConfig() {
      return this._columnConfig
    }

    /**
     * Get the base object ID.
     * @return {String} The base object ID.
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
      if (this._changes === undefined) {
        /** @type {{ object: this; key: string; value: any; message: string; }[]} */
        this._changes = []

        Object.entries(this.getBaseObject()).forEach(([key, currentValue]) => {
          const oldValue = this.getDatabaseObject()[key]

          if (oldValue !== currentValue) {
            const change = {
              object: this,
              key: key,
              value: currentValue,
              message: `Old ${key}: ${oldValue}\nNew ${key}: ${currentValue}`
            }
            this._changes.push(change)
          }
        })
      }

      return this._changes
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
     * @param {Object} [applyChanges] - Whether or not to apply the update to the database. Defaults to true.
     */
    update(applyChanges = true) {
      const changes = this.getChanges()

      changes.forEach(change => {
        this._dbObject[change.key] = change.value
        cosole.log(change.message)
      })

      if (applyChanges === true) {
        database().putData(service.getApiPath(), this.getDatabaseObject())
      }

      this._changes = []
    }
  }

  return CommonModel
}
