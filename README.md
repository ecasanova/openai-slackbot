# 🤖 OpenAI Slack Bot 🤖

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/webfactorystudio)

## Install on your Slack

[![Install](https://platform.slack-edge.com/img/add_to_slack.png)](https://slack.com/oauth/v2/authorize?client_id=4469473983430.4488721317217&scope=app_mentions:read,incoming-webhook,chat:write,chat:write.public,channels:history,groups:history,im:history,mpim:history&user_scope=)

# Local Installation

You need to register an app with Slack. To do this, visit: https://api.slack.com/apps/

You also need to register personal OpenAI API-Keys, visit: https://beta.openai.com/account/api-keys

You need to setup socket mode

## Permissions Scopes

You must configure the following permissions in your Slack App and generate the OAuth tokens

```
app_mentions:read
channels:history
channels:read
chat:write
chat:write.public
groups:history
im:history
incoming-webhook
mpim:history
chat:write.customize
channels:join
```

You also need setup socket mode in your app

## Enviroment variables

You must set the environment variables

```
OPENAI_API_KEY=
OPENAI_ORG_ID=
SLACK_SIGNING_SECRET=
SLACK_OAUTH_TOKEN=
SLACK_APP_TOKEN=
```

## Run the app

```
npm install
npm start
```

## Screenshots

![image1](screenshots/slack.png)

## Dependencies

[OpenAI](https://openai.com/)

[Slack-BoltJs](https://slack.dev/bolt-js/concepts)
