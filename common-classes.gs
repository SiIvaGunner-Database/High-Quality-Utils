/**
 * The class object for event log entries.
 */
class Event {
  /**
   * Creates an event object.
   *
   * @param {String} projectName The project name.
   * @param {String} message The event message.
   * @param {Date} logDate The event log date.
   */
  constructor(projectName, message, logDate) {
    this.projectName = projectName;
    this.message = message;
    this.logDate = logDate;
  }
}

/**
 * The class object for change log entries.
 */
class Change {
  /**
   * Creates a changelog object.
   *
   * @param {String} id The YouTube ID.
   * @param {String} type The type of change.
   * @param {String} oldValue The old value.
   * @param {String} newValue The new value.
   * @param {Date} logDate The change log date.
   */
  constructor(id, type, oldValue, newValue, logDate) {
    this.id = id;
    this.type = type;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.logDate = logDate;
  }
}
