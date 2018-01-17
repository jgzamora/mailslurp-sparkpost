'use strict';
const SparkPost = require('sparkpost');

// Sign up at SparkPost.com to get one of these for free
const spKey = 'your-sparkpost-api-key';
const client = new SparkPost(spKey);

const sendMail = (address) => {

  const transmission = {
    recipients: [{ address: { email: address }}],
    content: {
      from: 'Slurpy <hello@mail.avocado.industries>',
      subject: 'MailSlurp Test Email',
      html: '<html><body><p>Hello World</p></body></html>',
      text: 'Hello World!'
    }
  };

  return client.transmissions.send(transmission)
    .then(({ results }) => results)
    .catch((err) => {
      console.log('Error sending mail');
      console.log(err);
    });
};

module.exports = sendMail;
