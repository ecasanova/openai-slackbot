import SlackBot from "@slack/bolt";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";
const { App, LogLevel, ExpressReceiver } = SlackBot;

dotenv.config();

const databaseData = {};
const database = {
  set: async (key, data) => {
    console.log("key");
    databaseData[key] = data;
  },
  get: async (key) => {
    console.log("key");
    return databaseData[key];
  },
};

const receiver = new ExpressReceiver({
  logLevel: LogLevel.ERROR,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-state-secret",
  signatureVerification: "v2",
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
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      if (
        installation.isEnterpriseInstall &&
        installation.enterprise !== undefined
      ) {
        // support for org wide app installation
        return await database.set(installation.enterprise.id, installation);
      }
      if (installation.team !== undefined) {
        // single team app installation
        return await database.set(installation.team.id, installation);
      }
      throw new Error("Failed saving installation data to installationStore");
    },
    fetchInstallation: async (installQuery) => {
      // change the line below so it fetches from your database
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        // org wide app installation lookup
        return await database.get(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation lookup
        return await database.get(installQuery.teamId);
      }
      throw new Error("Failed fetching installation");
    },
    deleteInstallation: async (installQuery) => {
      // change the line below so it deletes from your database
      if (
        installQuery.isEnterpriseInstall &&
        installQuery.enterpriseId !== undefined
      ) {
        // org wide app installation deletion
        return await database.delete(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        return await database.delete(installQuery.teamId);
      }
      throw new Error("Failed to delete installation");
    },
  },
  installerOptions: {
    // If this is true, /slack/install redirects installers to the Slack authorize URL
    // without rendering the web page with "Add to Slack" button.
    // This flag is available in @slack/bolt v3.7 or higher
    directInstall: true,
    legacyStateVerification: true,
  },
});

const boltApp = new App({
  receiver,
});

const openAiConfiguration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAiConfiguration);

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

boltApp.event("app_mention", async ({ event, say }) => {
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
  await boltApp.start(process.env.PORT || 3000);
  console.log(
    `⚡️ OpenAi Slack bot is running on: http://localhost:${process.env.PORT}/slack/install`
  );
})();
