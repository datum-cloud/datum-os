# Email Templates

This directory contains some of the common emails which would be sent to users of the platform. If you're so inclined, a great feature addition to these would be lifting out things such as "Company name" into configurable variables which would allow for broader reuse. Additionally, the current `emails` package in this repository is pretty specific to Sendgrid, so an additional feature enhancement in the future would be to support multiple providers. In an attempt to make supporting multiple providers easier, the Sendgrid "rich emails" which you could call simply via UUID were not used and instead these templates were created. Given they are basic HTML text templates, they would work with nearly any paid or open source email provider of your choice assuming the interfaces / clients were implemented for them.

## Editing

These are the actual emails, language, format, that will be sent to users of the Datum platform so please exercise care with their updates. If you're uncertain, feel free to reachout to @matoszz for assistance.

## Preview Workflow (Temporary)

For right now the best way to test these email templates is to run:

`task test:emails`

Once run, you can preview the email templates in the `pkg/utils/emails/testdata/eyeballTestEmailBuilders` directory by changing the .mime file extension to .html and opening the file in your browser.

**NOTE:** You will need to remove the comments above the html file before previewing if you want an unadulterated view of the email template.
