import * as WebSocket from 'ws';
import { Message, Game, PlayerWebSocket } from './types';
const port = 8080;
let games = new Map<number, Game>();
var newGameIndex = 0;
import * as http from 'http';

export default class DoodlerWebSocketServer {
    CreateDoodlerWebSocketServer(server : http.Server) {
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
    }
  }
