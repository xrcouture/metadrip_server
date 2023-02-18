const sendEmail = require("./sendEmail");

const sendNotificationEmail = async (email) => {
  console.log(email)
  const message = `<p>A new user ${email} has subscribed to newsLetter</p>`;
  console.log(message)
  return sendEmail({
    to: "rakesh@xrcouture.com",
    subject: "New user subscribed",
    html: `<h4>Hello</h4>
   ${message}
   `,
  });
};

module.exports = sendNotificationEmail;
