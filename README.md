# postgraphql-hook-demo

## setup and demo
This demo builds upon <a href="https://github.com/postgraphql/postgraphql">postgraphql ^4.0</a> to show how to send
emails via <a href="https://www.mailgun.com/">mailgun</a>.

For now, <a href="https://github.com/stlbucket/postgraphql-hook">postgraphql-hook</a> is used to help setup the hook.  This
library may or may not be subsumed into the postgraphql library in some way.

After setting up your mailgun account, follow these steps to send an email through postgraphql:

```apple js
git clone https://github.com/stlbucket/postgraphql-hook-demo.git
```

Create a new database to use with the demo - 'pgql_hook' is a good name, but use whatever you like.

Copy 'example_config.js' to 'config.js' in root directory and update the following settings:

 - DB_CONNECTION_STRING
 - MAILGUN_API_KEY
 - MAILGUN_DOMAIN

```apple js
npm install
```

If you do not already have knex-migrate installed globally:
```apple js
npm install -g knex-migrate
```

```apple js
knex-migrate up
```

```apple js
npm start
```

Navigate to <a href="http://localhost:3000/graphiql">http://localhost:3000/graphiql</a> and execute this mutation:

```apple js
mutation {
  sendEmail(input: {
    _fromAddress: "YOUR VALID FROM EMAIL"
    _toAddress: "YOUR VALID TO EMAIL"
    _subject: "Mailgun Test"
    _body: "You got it, you get it, you're gonna get it!"
  }) {
    emailInfo {
      id
      fromAddress
      toAddress
      subject
      body
    }
  }
}
```

## the code that matters

<a href="https://github.com/stlbucket/postgraphql-hook-demo/blob/master/src/mutationHooks/sendEmail.js">sendEmail.js</a>

```apple js
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
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
      console.log('mailgun result', body)
    });
}

const plugin = appendMutation({
  mutationName: 'sendEmail',
  handler: handler
})

module.exports = plugin

```