require("dotenv").config(); //remove this in production
import * as express from "express";
const bodyParser = require('body-parser');
import DoodlerWebSocketServer from "./doodlerWebSocketServer";
import OpenAI from "openai";
import GptHelper from "./gptHelper";
import * as http from "http";
import { ChatGptResponse } from "./types";

const port = 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require("cors");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(
  cors({
    origin: "http://localhost:3000*",
  })
);

const doodlerServer = new DoodlerWebSocketServer();
const server = http.createServer(app);
doodlerServer.createDoodlerWebSocketServer(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/getChatGptDrawingAssignment", async (req, res) => {

  let gptHelper = new GptHelper();
  let numberOfContentsRequested = Number(req.query.numberOfContentsRequested);
  if (numberOfContentsRequested < 10) {
    let assistantContentList: string[] = [];
    for (let i = 0; i < numberOfContentsRequested; ++i) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: gptHelper.getChatGptQuestion(),
          },
        ],
        temperature: 1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 1.57,
        presence_penalty: 1,
      });
  
      let assistantContent = response.choices[0].message.content;
      if (assistantContent) {
        console.log("successfully got gpt content");
        assistantContentList.push(assistantContent);
      } else {
        console.log("unable to get gpt content");
      }
    }

    let gptResponse = {
      success: true,
      contentList: assistantContentList,
    } as ChatGptResponse;
    
    res.send(gptResponse);
  }
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port} :)`);
});
