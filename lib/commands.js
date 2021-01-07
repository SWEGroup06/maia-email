const UTILS = require("./utils.js");

module.exports = function (CONN, EMAIL) {
  const context = {
    login: {
      desc: `Login to Maia`,
      action: async function (event, data) {
        const res = await CONN.login(event.organiser);
        if (res.error) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Error",
            `<div>${res.error}</div>`
          );
          return;
        }
        if (res.url) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Login",
            `<div>Click <a href='${res.url}'>here</a> to login</div>`
          );
          return;
        }
        if (res.exists) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Login",
            `<div>You are already signed in</div>`
          );
        }
      },
    },
    logout: {
      desc: `Logout of Maia`,
      action: async function (event, data) {
        const res = await CONN.logout(event.organiser);
        if (res.error) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Error",
            `<div>${res.error}</div>`
          );
          return;
        }
        if (res.text) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Logout",
            `<div>You signed out of the Maia AI Calendar Assistant</div>`
          );
        }
      },
    },
    help: {
      desc: `Ask for help`,
      action: async function (event, data) {
        const body = Object.keys(context)
          .map((key) =>
            context[key].desc
              ? `<div><b>${key.toUpperCase()}</b>: ${context[key].desc}</div>`
              : ""
          )
          .join("\n");
        await EMAIL.mailer.sendMail(
          event.organiser,
          "Maia Calendar: Help",
          body
        );
      },
    },
    schedule: {
      desc: `Schedule a meeting`,
      action: async function (event, data) {
        const res = await CONN.schedule(
          [event.organiser, ...event.members],
          event.title && event.title.length ? `"${event.title}"` : data.title,
          data.duration,
          data.startDateRange,
          data.endDateRange,
          data.startTimeRange,
          data.endTimeRange,
          data.flexible,
          data.dayOfWeek,
          data.timeRangeSpecified
        );
        if (res.error) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Error",
            `<div>${res.error}</div>`
          );
          return;
        }
        await EMAIL.mailer.sendMail(
          event.organiser,
          "Maia Calendar: Schedule",
          `<div>${UTILS.message.generate.schedule(
            res.start,
            res.end,
            event.title
          )}</div>`
        );
      },
    },
    reschedule: {
      desc: `Reschedule a meeting`,
      action: async function (event, data) {
        const res = await CONN.reschedule(
          event.organiser,
          data.oldTitle,
          data.oldDateTime,
          data.newStartDateRange,
          data.newEndDateRange,
          data.newStartTimeRange,
          data.newEndTimeRange,
          data.newDayOfWeek,
          data.dateRangeSpecified,
          data.timeRangeSpecified,
          data.flexible
        );
        if (res.error) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Error",
            `<div>${res.error}</div>`
          );
          return;
        }
        await EMAIL.mailer.sendMail(
          event.organiser,
          "Maia Calendar: Reschedule",
          `<div>${UTILS.message.generate.reschedule(
            data.oldDateTime,
            res.start,
            data.oldTitle
          )}</div>`
        );

        return null;
      },
    },
    cancel: {
      desc: `Cancel a meeting`,
      action: async function (event, data) {
        const res = await CONN.cancel(
          event.organiser,
          data.meetingTitle,
          data.meetingDateTime
        );
        if (res.error) {
          await EMAIL.mailer.sendMail(
            event.organiser,
            "Maia Calendar: Error",
            `<div>${res.error}</div>`
          );
          return;
        }
        await EMAIL.mailer.sendMail(
          event.organiser,
          "Maia Calendar: Cancel",
          `<div>${UTILS.message.generate.cancel(res.title, res.dateTime)}</div>`
        );
      },
    },
  };

  return context;
};
