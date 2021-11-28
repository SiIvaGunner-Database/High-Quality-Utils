/**
 * The class object for YouTube videos.
 */
class Video {
  /**
   * Creates a YouTube video object.
   *
   * @param {String} id The video ID.
   * @param {String} title The video title.
   * @param {String} wikiStatus The video wiki status.
   * @param {String} youtubeStatus The video YouTube status.
   * @param {Date} uploadDate The video YouTube status.
   * @param {String} length The video length.
   * @param {String} description The video description.
   * @param {Integer} viewCount The video view count.
   * @param {Integer} likeCount The video like count.
   * @param {Integer} dislikeCount The video dislike count (discontinued).
   * @param {Integer} commentCount The video comment count.
   */
  constructor(id, title, wikiStatus, youtubeStatus, uploadDate, length, description, viewCount, likeCount, dislikeCount, commentCount) {
    this.id = id;
    this.title = title;
    this.wikiStatus = wikiStatus;
    this.youtubeStatus = youtubeStatus;
    this.uploadDate = uploadDate;
    this.length = length;
    this.description = description;
    this.viewCount = viewCount;
    this.likeCount = likeCount;
    this.dislikeCount = dislikeCount;
    this.commentCount = commentCount;
  }
}

/**
 * The class object for YouTube channels.
 */
class Channel {
  /**
   * Creates a YouTube channel object.
   *
   * @param {String} id The channel ID.
   * @param {String} name The channel name.
   * @param {String} wiki The channel wiki.
   * @param {String} youtubeStatus The channel YouTube status.
   * @param {Date} joinDate The channel join date.
   * @param {String} description The channel description.
   * @param {Integer} videoCount The channel video count.
   * @param {Integer} subscriberCount The channel subscriber count.
   * @param {Integer} viewCount The channel view count.
   */
  constructor(id, name, wiki, youtubeStatus, joinDate, description, videoCount, subscriberCount, viewCount) {
    this.id = id;
    this.name = name;
    this.wiki = wiki;
    this.youtubeStatus = youtubeStatus;
    this.joinDate = joinDate;
    this.description = description;
    this.videoCount = videoCount;
    this.subscriberCount = subscriberCount;
    this.viewCount = viewCount;
  }
}

/**
 * The class object for YouTube playlists.
 */
class Playlist {
  /**
   * Creates a playlist object.
   *
   * @param {String} id The playlist ID.
   * @param {String} title The playlist title.
   * @param {String} contributor The playlist contributor.
   * @param {String} channelId The channel ID.
   * @param {Integer} videoCount The playlist video count.
   * @param {Array[String]} videoIds The playlist video IDs.
   * @param {String} youtubeStatus The playlist status.
   */
  constructor(id, title, contributor, channelId, videoCount, videoIds, youtubeStatus) {
    this.id = id;
    this.title = title;
    this.contributor = contributor;
    this.channelId = channelId;
    this.videoCount = videoCount;
    this.videoIds = videoIds;
    this.youtubeStatus = youtubeStatus;
  }
}

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
