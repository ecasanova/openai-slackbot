# OpenAI Slack Bot

You need to register an app with Slack. To do this, visit: https://api.slack.com/apps/

You also need to register personal OpenAI API-Keys, visit: https://beta.openai.com/account/api-keys

## Permissions Scopes

You must configure the following permissions in your Slack App and generate the OAuth tokens

```
app_mentions:read
im:read
im:write
mpim:read
mpim:write
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
