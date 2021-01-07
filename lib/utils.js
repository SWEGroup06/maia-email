const { DateTime } = require("luxon");

const CONSTS = {
  messages: {
    responses: [
      "Sure thing!",
      "No problem!",
      "Of course!",
      "Done!",
      "Certainly!",
      "No problem!",
    ],
  },
  emojis: {
    reactions: ["😊", "👍🏽", "✅", "😀", "😇", "🙂", "😎", "😌", "🤓"],
    calendar: "📆",
  },
};

/**
 * Generates a random number up to a given value.
 *
 * @param {Array} array - Maximum value.
 * @return {object} - Returns a random element in the array
 */
const random = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const context = {
  message: {
    generate: {
      /**
       * Returns a schedule message upon successful schedule.
       *
       * @param {string} start - Chosen start date and time of the event.
       * @param {string} end - Chosen end date and time of the event.
       * @param {string} title - Given title of event (optional).
       * @return {string} - Returns nicely formatted message.
       */
      schedule: function (start, end, title) {
        start = DateTime.fromISO(start).toLocaleString(
          DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        end = DateTime.fromISO(end).toLocaleString(
          DateTime.DATETIME_MED_WITH_WEEKDAY
        );

        return `${random(CONSTS.messages.responses)} ${random(
          CONSTS.emojis.reactions
        )} I've booked ${
          title && title.length ? title : "an event"
        } from <b>${start}</b> to <b>${end}</b> ${
          CONSTS.emojis.calendar
        }.\n To reschedule, just let me know.`;
      },
      /**
       * Returns a reschedule message upon successful reschedule.
       *
       * @param {string} oldDate - Previous date of the event.
       * @param {string} newDate - New date of the event.
       * @param {string} title - Event title, if given.
       * @return {string} - Returns a nicely formatted message.
       */
      reschedule: function (oldDate, newDate, title) {
        newDate = DateTime.fromISO(newDate).toLocaleString(
          DateTime.DATETIME_MED_WITH_WEEKDAY
        );
        oldDate = oldDate
          ? DateTime.fromISO(oldDate)
              .plus({ hours: 1 })
              .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
          : null;
        return `${random(CONSTS.messages.responses)} ${random(
          CONSTS.emojis.reactions
        )} I've moved ${
          oldDate
            ? `<b>${oldDate}</b>`
            : `${title && title.length ? title : "your event"}`
        } to ${newDate}. ${CONSTS.emojis.calendar}`;
      },
      /**
       * Posts a message to the user upon successful cancellation.
       *
       * @param {string} title - Title of the event which has been cancelled.
       * @param {string} dateTimeISO - Date and time of event cancelled.
       * @return {string} - Understandable message posted to user.
       */
      cancel: function (title, dateTimeISO) {
        return `${random(CONSTS.messages.responses)} ${random(
          CONSTS.emojis.reactions
        )} I've cancelled \"${title}\", which was booked for <b>${DateTime.fromISO(
          dateTimeISO
        ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</b>. ${
          CONSTS.emojis.calendar
        }`;
      },
    },
  },
};

module.exports = context;
