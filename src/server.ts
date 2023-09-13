require('dotenv').config(); //remove this in production
import * as express from 'express';
import DoodlerWebSocketServer from './doodlerWebSocketServer';
import OpenAI from "openai";
import GptHelper from './gptHelper';
import * as http from 'http';
import { ChatGptResponse } from './types';

const port = 8080;
const app = express();
const cors = require('cors');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({
    origin: 'http://localhost:3000*'
})); 

const doodlerServer = new DoodlerWebSocketServer();
const server = http.createServer(app);
doodlerServer.createDoodlerWebSocketServer(server);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/getChatGptDrawingAssignment', async (req, res) => {
  let gptHelper = new GptHelper()
    let userContent = gptHelper.getChatGptQuestion()
    let gptResponse = {
      success: true,
      content: ''
    } as ChatGptResponse;
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": userContent
          }
        ],
        temperature: 1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 1.57,
        presence_penalty: 1,
      });

      let assistantContent = response.choices[0].message.content;
      if (assistantContent) {
        console.log('successfully got gpt content')
        gptResponse.success = true;
        gptResponse.content = assistantContent;
        res.send(gptResponse);
      }
      else {
        console.log('unable to get gpt content')
      }
        
    res.send(gptResponse);
  })

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port} :)`);
});