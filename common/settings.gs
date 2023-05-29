let Settings

/**
 * Settings class for static methods.
 * @return {Class} The settings class.
 */
function Settings_() {
  if (Settings === undefined) Settings = class Settings {
    /**
     * Create a settings object.
     */
    constructor() {
      this._isDevModeEnabled = false
      this._isYoutubeApiEnabled = true
      this._authToken = ""
    }

    /**
     * Set an admin authentication token for access to the siivagunnerdatabase.net API.
     * The authentication token must be set before service classes can be used.
     * The value can be set manually by going to project settings and adding a script property with the key "authToken".
     * @param {ScriptProperties} scriptProperties - The script properties object.
     * @param {String} [value] - The optional authentication token value. Overwrites any token value previously set.
     */
    setAuthToken(scriptProperties, value) {
      if (value !== undefined) {
        scriptProperties.setProperty(this.getAuthTokenKey(), value)
      }

      this._authToken = scriptProperties.getProperty(this.getAuthTokenKey())
    }

    /**
     * Get a siivagunnerdatabase.net admin authentication token.
     * @return {String} The authentication token.
     * @throws {MissingPropertyError} Thrown if no script property with the key "authToken" exists.
     */
    getAuthToken() {
      if (this._authToken === undefined) {
        throw new Error(`You must create a property with the key '${this.getAuthTokenKey()}' in order to use this method`)
      }

      return `Token ${this._authToken}`
    }

    /**
     * Get the constant authentication token key.
     * @return {String} The authentication token key.
     */
    getAuthTokenKey() {
      return "authToken"
    }

    /**
     * Get the account ID for spreadsheet-bot.
     * @return {Number} The account ID.
     */
    getBotId() {
      return 2
    }

    /**
     * Enable development mode for development evironment testing.
     */
    enableDevMode() {
      this._isDevModeEnabled = true
    }

    /**
     * Disable development mode for production evironment work.
     * Development mode is disabled by default.
     */
    disableDevMode() {
      this._isDevModeEnabled = false
    }

    /**
     * Get the current status of development mode.
     * @return {Boolean} True if development mode is enabled, else false.
     */
    isDevModeEnabled() {
      return this._isDevModeEnabled
    }

    /**
     * Enable the YouTube API to include YouTube metadata in objects returned by services.
     * The YouTube API is enabled by default.
     */
    enableYoutubeApi() {
      this._isYoutubeApiEnabled = true
    }

    /**
     * Disable the YouTube API to include YouTube metadata in objects returned by services.
     */
    disableYoutubeApi() {
      this._isYoutubeApiEnabled = false
    }

    /**
     * Get the current status of the YouTube API.
     * @return {Boolean} True if the YouTube API is enabled, else false.
     */
    isYoutubeApiEnabled() {
      return this._isYoutubeApiEnabled
    }

    /**
     * Enable service class caching.
     * Caching is enabled by default.
     */
    enableCache() {
      channels().enableCache()
      playlists().enableCache()
      sheets().enableCache()
      videos().enableCache()
    }

    /**
     * Disable service class caching.
     */
    disableCache() {
      channels().disableCache()
      playlists().disableCache()
      sheets().disableCache()
      videos().disableCache()
    }

    /**
     * Deletes all triggers associated with the project.
     */
    deleteTriggers() {
      ScriptApp.getProjectTriggers().forEach(trigger => {
        ScriptApp.deleteTrigger(trigger)
      })
    }
  }

  return Settings
}

let theSettings

/**
 * Get the common settings.
 * return {Settings} The settings object.
 */
function settings() {
  if (theSettings === undefined) {
    theSettings = new (Settings_())()
  }

  return theSettings
}
