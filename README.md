# OpenAI Slack Bot 

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/webfactorystudio)

You need to register an app with Slack. To do this, visit: https://api.slack.com/apps/

You also need to register personal OpenAI API-Keys, visit: https://beta.openai.com/account/api-keys

## Install on your Slack

[![Install]([https://img.shields.io/badge/slack.svg](https://platform.slack-edge.com/img/add_to_slack.png))](https://openai-slackbot.onrender.com/slack/install)


## Permissions Scopes

You must configure the following permissions in your Slack App and generate the OAuth tokens

```
app_mentions:read
im:read
im:write
im:history
mpim:read
mpim:write
mpim:history
channels:history
groups:history
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
