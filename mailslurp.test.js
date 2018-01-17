'use strict';

const MailslurpClient = require('mailslurp-client');
const sendEmail = require('./sendEmail.js');

// initiate the MailSlurp Client
const slurp = new MailslurpClient.InboxcontrollerApi()

// Sign up at MailSlurp.com to get one of these for free.
const slurpKey = process.env.MS_APIKEY;

describe('SendEmail Tests', () => {

  let address;
  let inboxId;

  beforeAll(() => {
    // Creates the inbox and set address & inboxId for use in tests
    return slurp.createRandomInboxUsingPOST(slurpKey)
      .then(({ payload }) => {
        address = payload.address; // the email address we will be sending to
        inboxId = payload.id;      // UUID used to identify the inbox (And is the local part to address)
      });
  });

  test('Email delivers', () => {
    // increase the default jest timeout to be able to wait for delivery
    jest.setTimeout(60000);

    // pass address given to us by MailSlurp
    return sendEmail(address)
      .then(({ total_accepted_recipients }) => {
        // make sure SparkPost accepted the request
        expect(total_accepted_recipients).toEqual(1);

        // Get the list of emails from the inbox
        return slurp.getEmailsForInboxUsingGET(slurpKey, inboxId,
          {
            minCount: 1, // minumum number of emails to wait for, wait time is 60 seconds by default
          })
          .then(({ payload }) => {
            // console.log(payload) // uncomment this to see the full email
            expect(payload).toHaveLength(1);
            const [ email ] = payload;
            expect(email.subject).toEqual('MailSlurp Test Email');
          });
      });
  });
});
