const sendEmail = require("./sendEmail");

const sendNotificationEmail = async (message, mailSubject) => {
  const footer = '<br><p>Thanks,<br>XR Couture</p>'

  return sendEmail({
    to: "rakesh@xrcouture.com, media@xrcouture.com, hello@xrcouture.com",
    subject: mailSubject,
    html: `<h4>Hello Team</h4>
   ${message}
   ${footer}
   `,
  });
};

module.exports = sendNotificationEmail;
