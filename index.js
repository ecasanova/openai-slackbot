import SlackBot from "@slack/bolt";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
const { App, LogLevel, ExpressReceiver, FileInstallationStore } = SlackBot;

dotenv.config();

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

const receiver = new ExpressReceiver({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET, // Find in Basic Information Tab
  appToken: process.env.SLACK_APP_TOKEN, // Token from the App-level Token that we created
  socketMode: false,
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
  installationStore: new FileInstallationStore(),
  installerOptions: {
    // If this is true, /slack/install redirects installers to the Slack authorize URL
    // without rendering the web page with "Add to Slack" button.
    // This flag is available in @slack/bolt v3.7 or higher
    directInstall: true,
    legacyStateVerification: true,
  },
});

const app = new App({
  receiver,
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

receiver.router.get("/", (req, res) => {
  res.status(200);
  res.send("⚡️ Welcome to the OpenAI Slack bot! ⚡️");
});

(async () => {
  // Start your app
  try {
    let hostname =
      process.env.ENVIRONMENT == "development"
        ? `http://localhost:${process.env.PORT}`
        : `https://${process.env.HOSTNAME}`;
    console.log(
      `⚡️ OpenAi Slack bot is running on: ${hostname}/slack/install`
    );
    await app.start(process.env.PORT || 3000);
    //await receiver.start(process.env.PORT || 3000);
  } catch (error) {
    console.error("Unable to start App", error);
    process.exit(1);
  }
})();
