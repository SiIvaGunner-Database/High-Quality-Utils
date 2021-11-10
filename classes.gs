/**
 * The class object for YouTube videos.
 */
class Video {
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
  constructor(id, name, wikiStatus, youtubeStatus, joinDate, description, videoCount, subscriberCount, viewCount) {
    this.id = id;
    this.name = name;
    this.wikiStatus = wikiStatus;
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
  constructor(id, oldValue, newValue, logDate) {
    this.id = id;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.logDate = logDate;
  }
}
