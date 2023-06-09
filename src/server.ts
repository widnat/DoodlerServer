import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Message, Game, PlayerWebSocket } from './types';
const port = 8080;
const doodler = express();
const cors = require('cors');
doodler.use(cors({
    origin: 'http://localhost:3000*'
})); 
let games = new Map<number, Game>();
var newGameIndex = 0;

const server = http.createServer(doodler);
const webSocketServer = new WebSocket.Server({ server });

webSocketServer.on('connection', (webSocket: WebSocket) => {

    webSocket.on('message', (message: string, isBinary) => {
        handleClientMessage(message, isBinary)
        // webSocket.send(`Hello, you sent -> ${message}`);
    });
    
    if (webSocket.protocol === "presenter") {
        const newGame = {
            presenterWebSocket: webSocket,
            playerWebSockets: new Array<PlayerWebSocket>,
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
        if (game) {
            let playerId = game.playerWebSockets.length;
            let playerWebSocket = {
                playerId: playerId,
                webSocket: webSocket
            } as PlayerWebSocket;
            game.playerWebSockets.push(playerWebSocket);

            var response = {
                type: "player id",
                value: String(playerId)
            } as Message;
            var jsonResponse = JSON.stringify(response);
            webSocket.send(jsonResponse);
        }
    }
});

// presenter creates a new connection and says to close, remove the old presenter and put this presenter in its place
// then the presenter tells the children to go to the next round
// the children tell the server to close the connection and remove the child
// the child goes to the next round and makes a new connection

server.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port} :)`);
});

function handleClientMessage(msg: string, isBinary: boolean) {
    const message = JSON.parse(msg) as Message;
    var receivedMessage = "recieved message type: " + message.type;
    console.log(receivedMessage);
    if (message.type === "add player" || message.type === "submit assignment doodle" || message.type === "submit first guess" || message.type === "submit second guess") {
        console.log("sending message to presenter");
        var game = games.get(message.gameIndex);
        if (game) {
            let presenterWebSocket = game.presenterWebSocket;
            msg = isBinary ? msg : msg.toString();
            presenterWebSocket.send(msg);
        }
    }
    else if (message.type === "create doodle" || message.type === "sit back and relax" || message.type === "time to guess" || message.type === "time to guess again") {
        var sendingMessage = "sending message to playerId: " + message.playerId;
        console.log(sendingMessage);
        var game = games.get(message.gameIndex);
        if (game) {
            msg = isBinary ? msg : msg.toString();
            let playerWebSocket = game.playerWebSockets[message.playerId];
            playerWebSocket.webSocket.send(msg);
        }
    }
    
}
