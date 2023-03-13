import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddPlayerUpdate, Message, Connection, Game } from './types';
const port = 8080;
const doodler = express();
const cors = require('cors');
doodler.use(cors({
    origin: 'http://localhost:3000'
})); 
let games = new Map<number, Game>();
var newGameIndex = 0;

const server = http.createServer(doodler);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', (webSocket: WebSocket) => {

    webSocket.on('message', (message: string) => {
        handleClientMessage(message, webSocket)
        // ws.send(`Hello, you sent -> ${message}`);
    });

    if (webSocket.protocol === "presenter") {
        const newGame = {
            presenterWebSocket: webSocket,
            childrenWebSockets: new Array<WebSocket>,
        } as Game;
        games.set(newGameIndex, newGame);
        var response = {
            type: "game index",
            value: String(newGameIndex)
        } as Message;
        var jsonResponse = JSON.stringify(response);
        webSocket.send(jsonResponse);
        ++newGameIndex;
    }
    else if (!isNaN(+webSocket.protocol)) {
        var gameIndex = Number(webSocket.protocol);
        var game = games.get(gameIndex);
        if (game)
            game.childrenWebSockets.push(webSocket);
    }
});

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port} :)`);
});

function handleClientMessage(msg: string, webSocket: WebSocket) {
    // const message = JSON.parse(msg) as Message;
    // if (message.type === "add player") {
    //     const addPlayerUpdate = JSON.parse(message.value) as AddPlayerUpdate;
    //     addPlayerUpdate.
    // }
}
