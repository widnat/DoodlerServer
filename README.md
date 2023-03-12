mkdir websocket-node-express
cd websocket-node-express
npm init
// add the details of your project
npm i ws express --save
// install the necessary types (and typescript)...
npm i typescript @types/ws @types/express -D
// ...optionally install typescript globally (tnx _Maxxx_)
npm i -g typescript

create file src/server.ts =>

import _ as express from 'express';
import _ as http from 'http';
import \* as WebSocket from 'ws';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');

});

//start our server
server.listen(process.env.PORT || 8999, () => {
console.log(`Server started on port ${server.address().port} :)`);
});

add tsconfig.json =>

{
"compilerOptions": {
"target": "es6",
"module": "commonjs",
"outDir": "./dist/server",
"strict": true,
"sourceMap": true,
"typeRoots": [
"node_modules/@types"
]
},
"exclude": [
"dist",
"node_modules"
]
}

// please compile my code
./node_modules/.bin/tsc // or simply tsc (if installed globally)

// then run the server
node ./dist/server/server.js

Add cors to app
npm i cors express nodemon

const cors = require('cors');
app.use(cors({
origin: 'https://www.section.io'
}));
