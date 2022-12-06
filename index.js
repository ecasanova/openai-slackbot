import SlackBot from "@slack/bolt";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const { App } = SlackBot;

dotenv.config();

const app = new App({
  token: process.env.SLACK_OAUTH_TOKEN, //Find in the Oauth  & Permissions tab
  signingSecret: process.env.SLACK_SIGNING_SECRET, // Find in Basic Information Tab
  appToken: process.env.SLACK_APP_TOKEN, // Token from the App-level Token that we created
  socketMode: true,
});

const openAiConfiguration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAiConfiguration);

app.event("app_mention", async ({ event, say }) => {
  try {
    let query = event.text.substr(event.text.indexOf(" ") + 1);
    const rsp = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: query,
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
      stop: ["You:"],
    });
    let rspChat = rsp.data.choices[0].text.replace(/[\r\n]/gm, "");
    await say(`<@${event.user}>: ${rspChat}`);
  } catch (error) {
    console.error(error);
  }
});
app.start(3000);
