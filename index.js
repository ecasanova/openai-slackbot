import SlackBot from "@slack/bolt";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
const { App, LogLevel, FileInstallationStore } = SlackBot;

dotenv.config();

const hostname =
  process.env.ENVIRONMENT == "development"
    ? `http://localhost:${process.env.PORT}`
    : `https://${process.env.HOSTNAME}`;

/* OpenAI Config */
const openAiConfiguration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

/* OpenAI Init */
const openai = new OpenAIApi(openAiConfiguration);

/* OpenAI Search */
const openApiSearch = async (event) => {
  let query = event.text.substr(event.text.indexOf(" ") + 1);
  let rsp = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: query,
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.0,
    stop: ["You:"],
  });
  return rsp.data.choices[0].text.replace(/[\r\n]/gm, "");
};

const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET, // Find in Basic Information Tab
  appToken: process.env.SLACK_APP_TOKEN, // Token from the App-level Token that we created
  socketMode: true,
  customRoutes: [
    {
      path: "/",
      method: ["GET"],
      handler: (req, res) => {
        res.writeHead(200);
        res.end("⚡️ Welcome to the OpenAI Slack bot! ⚡️");
      },
    },
  ],
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-state-secret",
  scopes: [
    "app_mentions:read",
    "channels:history",
    "channels:read",
    "chat:write",
    "chat:write.public",
    "groups:history",
    "im:history",
    "incoming-webhook",
    "mpim:history",
    "chat:write.customize",
    "channels:join",
  ],
  redirectUri: `${hostname}/slack/oauth_redirect`, // here
  installationStore: new FileInstallationStore(),
  installerOptions: {
    // If this is true, /slack/install redirects installers to the Slack authorize URL
    // without rendering the web page with "Add to Slack" button.
    // This flag is available in @slack/bolt v3.7 or higher
    directInstall: true,
    legacyStateVerification: true,
    redirectUriPath: `/slack/oauth_redirect`, // and here!
  },
});

app.event("app_mention", async ({ event, say }) => {
  try {
    console.log("app_mention");
    let rsp = await openApiSearch(event);
    await say(`<@${event.user}>: ${rsp}`);
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  try {
    console.log(
      `⚡️ OpenAi Slack bot is running on: ${hostname}/slack/install`
    );
    await app.start(process.env.PORT || 3000);
  } catch (error) {
    console.error("Unable to start App", error);
    process.exit(1);
  }
})();
