const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.MAILGUN_DOMAIN

const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain})
const appendMutation = require('postgraphql-hook').appendMutation

async function handler (args, result) {
  const emailInfo = result.data

  const mailgunData = {
    from: `Postgraphql-Mailgun Demo <${emailInfo.fromAddress}>`,
    to: emailInfo.toAddress,
    subject: emailInfo.subject,
    text: emailInfo.body
  }

  console.log('SENDING EMAIL', emailInfo)

  mailgun
    .messages()
    .send(mailgunData, function (error, body) {
      if (error) {
        console.log('MAILGUN ERROR', error)
      } else {
        console.log('MAILGUN RESULT', body)
      }
    })
}

const plugin = appendMutation({
  mutationName: 'sendEmail',
  handler: handler
})

module.exports = plugin
