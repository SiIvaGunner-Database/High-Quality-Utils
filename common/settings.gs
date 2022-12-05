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
      this._devMode = false
    }

    /**
     * Set an admin authentication token for access to the siivagunnerdatabase.net API.
     * The authentication token must be set before the service classes can be used.
     * This can also be done manually by going to project settings and adding a script property with the key "authToken".
     * @param {ScriptProperties} scriptProperties - The script properties object.
     * @param {String} value - The authentication token.
     */
    setAuthToken(scriptProperties, value) {
      scriptProperties.setProperty(utils().getAuthTokenKey(), value)
    }

    /**
     * Enable development mode for development evironment testing.
     */
    enableDevMode() {
      this._devMode = true
    }

    /**
     * Disable development mode for production evironment work.
     * Development mode is disabled by default.
     */
    disableDevMode() {
      this._devMode = false
    }

    /**
     * Get the current status of development mode.
     * @return {Boolean} True if development mode is enabled, else false.
     */
    isDevMode() {
      return this._devMode
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
  }

  return Settings
}

let theSettings

/**
 * Get the common settings.
 * return {Settings} The settings object.
 */
function settings() {
  if (theSettings === undefined) theSettings = new Settings_()

  return theSettings
}
