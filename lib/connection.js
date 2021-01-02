const CONFIG = require("../config.js");

const axios = require("axios");

const context = {
  /**
   *
   * @param {string} path - API URL to make the request to.
   * @param {object} params - Parameters to pass to the call.
   * @return {object} - Returns the response data of the API call.
   */
  _request: async function (path, params) {
    // Encode each parameter for each request
    Object.keys(params).forEach(
      (p) => (params[p] = encodeURIComponent(JSON.stringify(params[p])))
    );

    // Make GET request
    const res = await axios.get(CONFIG.serverURL + path, { params });
    return res.data;
  },

  /**
   * TODO:
   *
   * @param {string} googleEmail - Unique email relating to Google account
   * @return {Promise<any>} - API call to the backend
   */
  login: function (googleEmail) {
    return context._request("/auth/login", { googleEmail });
  },

  /**
   * TODO: Rename to schedule
   *
   * @param {Array} googleEmails - Google email addresses of all attendees
   * @param {string} title - Optional titling of the event
   * @param {number} duration - Duration of the event (in minutes)
   * @param {string} startDateRange - Start date range it may be scheduled for
   * @param {string} endDateRange - End date range it may be scheduled for
   * @param {string} startTimeRange - Start time range it may be scheduled for
   * @param {string} endTimeRange - End time range it may be scheduled for
   * @param {boolean} flexible - Whether the event is flexible or not
   * @param {string} dayOfWeek - Which day(s) of the week to scheduled for
   * @param {boolean} timeRangeSpecified - Whether user has specified time range
   * @return {Promise<any>} - An API call to the back-end
   */
  schedule: function (
    googleEmails,
    title,
    duration,
    startDateRange,
    endDateRange,
    startTimeRange,
    endTimeRange,
    flexible,
    dayOfWeek,
    timeRangeSpecified
  ) {
    return context._request("/api/schedule", {
      googleEmails,
      title,
      duration,
      startDateRange,
      endDateRange,
      startTimeRange,
      endTimeRange,
      flexible,
      dayOfWeek,
      timeRangeSpecified,
    });
  },

  /**
   * TODO: Change 'busy' to 'free' everywhere
   *
   * @param {string} googleEmail - Unique email relating to Google account
   * @param {Array} busyDays - Days which the user is able to work.
   * @param {Array} busyTimes - Times which the user is able to work.
   * @return {Promise<any>} - API call to the backend
   */
  constraints: function (googleEmail, busyDays, busyTimes) {
    return context._request("/api/constraints", {
      googleEmail,
      busyDays,
      busyTimes,
    });
  },

  /**
   * TODO:
   *
   * @param {string} googleEmail - Unique email relating to Google account
   * @param {string} meetingTitle - Title of the event to be cancel
   * @param {string} meetingDateTime - Date and time of event to cancel
   * @return {Promise<any>} - API call to the backend to cancel the event
   */
  cancel: function (googleEmail, meetingTitle, meetingDateTime) {
    return context._request("/api/cancel", {
      googleEmail,
      meetingTitle,
      meetingDateTime,
    });
  },

  /**
   * TODO:
   *
   * @param {string} text - String input by the user to Slack app
   * @return {Promise<any>} - API call to the backend
   */
  nlp: function (text) {
    return context._request("/nlp", { text });
  },

  /**
   * TODO:
   *
   * @param {string} googleEmail - Unique email relating to Google account
   * @return {Promise<any>} - API call to the backend
   */
  preferences: function (googleEmail) {
    return context._request("/api/preferences", { googleEmail });
  },

  /**
   * TODO:
   *
   * @param {string} googleEmail - Unique email relating to Google account
   * @param {string} oldTitle - Title of event to reschedule
   * @param {string} oldDateTime - Date and time of event to reschedule
   * @param {string} newStartDateRange - Start of range to reschedule event to
   * @param {string} newEndDateRange - End of range to reschedule event to
   * @param {string} newStartTimeRange - Start of possible time to reschedule to
   * @param {string} newEndTimeRange - End of possible time to reschedule to
   * @param {string} newDayOfWeek - Specified day(s) of the week to reschedule
   * @param {boolean} dateRangeSpecified - Whether user has specified dates
   * @param {boolean} timeRangeSpecified - Whether user has specified times
   * @param {boolean} flexible - Whether the event is flexible or not
   * @return {Promise<any>} - API call to the backend
   */
  reschedule: function (
    googleEmail,
    oldTitle,
    oldDateTime,
    newStartDateRange,
    newEndDateRange,
    newStartTimeRange,
    newEndTimeRange,
    newDayOfWeek,
    dateRangeSpecified,
    timeRangeSpecified,
    flexible
  ) {
    return context._request("/api/reschedule", {
      googleEmail,
      oldTitle,
      oldDateTime,
      newStartDateRange,
      newEndDateRange,
      newStartTimeRange,
      newEndTimeRange,
      newDayOfWeek,
      dateRangeSpecified,
      timeRangeSpecified,
      flexible,
    });
  },
};

module.exports = context;
