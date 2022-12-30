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
    constructor(originalObject, databaseObject, service, columnConfig = { sortColumn: 1, columns: {} }) {
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
    getValues(wiki) {
      return [Object.values(this._columnConfig.columns).map(columnKey => {
        const dbObject = this.getDatabaseObject()
        let value = dbObject[columnKey]
        console.log(value, value.toString().length, value.toString().endsWith("Z"))

        if (value === undefined || value === null) {
          value = ""
        } else if (columnKey === "id") {
          value = utils().formatYoutubeHyperlink(value)
        } else if (columnKey === "title" && wiki !== undefined) {
          value = utils().formatFandomHyperlink(value, wiki)
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
        /** @type {{ object: this; key: string; value: any; message: string; }[]} */
        this._changes = []

        Object.entries(this.getOriginalObject()).forEach(([key, currentValue]) => {
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
        this.getDatabaseObject()[change.key] = change.value
        // console.log(change.message)
      })

      if (applyChanges === true) {
        database().putData(service.getApiPath(), this.getDatabaseObject())
      }

      this._changes = []
    }
  }

  return CommonModel
}
