let CommonModel

/**
 * Model class representing a database object.
 * @return {Class} The model class.
 */
function CommonModel_() {
  if (CommonModel === undefined) CommonModel = class CommonModel {
    /**
     * Create a common model object.
     * @param {Object} originalObject - The base object (YouTube, Google Sheets, etc.).
     * @param {Object} databaseObject - The database metadata.
     * @param {Object} service - The related service object.
     * @param {Object} [columnConfig] - The optional column map configuration for objects with corresponding sheets.
     */
    constructor(originalObject, databaseObject, service, columnConfig = { "sortColumn": 1, "columns": {} }) {
      this._originalObject = originalObject
      this._databaseObject = databaseObject
      this._service = service
      this._columnConfig = columnConfig
      this._id = (databaseObject !== undefined ? databaseObject.id : originalObject.id)
      this._changes
      service.addToCache_(this)
    }

    /**
     * Get the column configuration.
     * @return {Object} The column configuration.
     */
    getColumnConfig() {
      return this._columnConfig
    }

    /**
     * Get row and column values for use in a sheet.
     * @param {String} [wikiName] - An optional wiki name to use in a hyperlink for the title if a value is provided.
     * @return {Array[Array[Object]]} The values.
     */
    getValues(wikiName) {
      return [Object.values(this._columnConfig.columns).map(columnKey => {
        const dbObject = this.getDatabaseObject()
        let value = dbObject[columnKey]
        console.log(value, value.toString().length, value.toString().endsWith("Z"))

        if (value === undefined || value === null) {
          value = ""
        } else if (columnKey === "id") {
          value = utils().formatYoutubeHyperlink(value)
        } else if (columnKey === "title" && wikiName !== undefined) {
          value = utils().formatFandomHyperlink(value, wikiName)
        } else if (value.toString().match(/^.+T.+Z$/) !== null) {
          value = utils().formatDate(value)
        }

        return value
      })]
    }

    /**
     * Get the object ID.
     * @return {String} The object ID.
     */
    getId() {
      return this._id
    }

    /**
     * Get the base object.
     * @return {Object} The base object.
     */
    getOriginalObject() {
      return this._originalObject
    }

    /**
     * Get the database metadata.
     * @return {Object} The database metadata.
     */
    getDatabaseObject() {
      return this._databaseObject
    }

    /**
     * Get a list of differences between the base object and the database object.
     * @return {Array[String]} An array of database object keys for any new values.
     */
    getChanges() {
      if (this._changes === undefined) {
        /** @type {{ key: String; labe: String; oldValue: any; newValue: any; message: String; timestamp: Date; }[]} */
        this._changes = []

        if (this.getOriginalObject() !== undefined && this.getDatabaseObject() !== undefined) {
          Object.entries(this.getOriginalObject()).forEach(([key, currentValue]) => {
            const oldValue = this.getDatabaseObject()[key]

            // "!=" is intentionally used instead of "!==" here
            if (oldValue != currentValue) {
              const change = {
                "key": key,
                "label": utils().capitalizeString(key),
                "oldValue": oldValue,
                "newValue": currentValue,
                "message": `Old ${key} [${typeof oldValue}]: ${JSON.stringify(oldValue)}\n\nNew ${key} [${typeof currentValue}]: ${JSON.stringify(currentValue)}`,
                "timestamp": utils().formatDate()
              }
              this._changes.push(change)
            }
          })
        }
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
     * Update the database object and apply the changes to the web application.
     * @param {Boolean} [applyChanges] - Whether or not to apply the update to the database. Defaults to true.
     */
    update(applyChanges = true) {
      const changes = this.getChanges()

      changes.forEach(change => {
        this.getDatabaseObject()[change.key] = change.newValue
      })

      if (applyChanges === true) {
        database().putData(this._service.getApiPath(), this.getDatabaseObject())
      }

      this._changes = []
    }

    /**
     * Create the database object and apply the changes to the web application.
     * @param {Object} [defaults] - An object of default values to add to the database object.
     * @param {Boolean} [applyChanges] - Whether or not to apply the update to the database. Defaults to true.
     */
    createDatabaseObject(defaults = {}, applyChanges = true) {
      this._databaseObject = {
        "visible": true,
        "author": settings().getBotId(),
        ...defaults
      }

      this.update(false)

      if (applyChanges === true) {
        database().postData(this._service.getApiPath(), this.getDatabaseObject())
      }
    }
  }

  return CommonModel
}
