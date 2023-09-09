import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Message, Game, PlayerWebSocket } from './types';
import DoodlerWebSocketServer from './socketServer';

const port = 8080;
const doodler = express();
const cors = require('cors');
doodler.use(cors({
    origin: 'http://localhost:3000*'
})); 
let games = new Map<number, Game>();
var newGameIndex = 0;

const server = http.createServer(doodler);
const doodlerServer = new DoodlerWebSocketServer();
doodlerServer.CreateDoodlerWebSocketServer(server);

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port} :)`);
});
