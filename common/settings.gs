let Settings

/**
 * Settings class for static methods.
 * @return {Class} The settings class.
 */
function Settings_() {
  if (Settings == undefined) Settings = class Settings {
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

    enableCache() {
      youtubeService().enableCache()
      databaseService().enableCache()
    }

    disableCache() {
      youtubeService().disableCache()
      databaseService().disableCache()
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
  if (theSettings == undefined) theSettings = new Settings_()

  return theSettings
}
