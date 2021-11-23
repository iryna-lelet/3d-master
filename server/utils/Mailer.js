const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const { email } = require('../config/config.json');

const noreply = nodemailer.createTransport({
  service: 'gmail',
  auth: email
});

const subjects = {
  thanks: 'Thank you for your order!'
}

const send = async ({ to, subject, template, data }) => {
  try {
    const hbs = fs.readFileSync(`./server/emails/${template}.hbs`, 'utf8');
    const model = handlebars.compile(hbs);
    const info = await noreply.sendMail({
      from: `"Wrap" <${email.user}>`,
      to,
      subject: subjects[template],
      html: model(data)
    });
    return info;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { send };
