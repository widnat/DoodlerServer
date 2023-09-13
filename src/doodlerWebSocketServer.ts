import * as WebSocket from 'ws';
import { Message, Game, PlayerWebSocket, ChatGptResponse } from './types';
import * as http from 'http';
import { MessageType } from './doodler';
let games = new Map<number, Game>();
var newGameIndex = 0;

export default class DoodlerWebSocketServer {
    createDoodlerWebSocketServer(server : http.Server) {
        const webSocketServer = new WebSocket.Server({ server });
        webSocketServer.on('connection', (webSocket: WebSocket) => {

            webSocket.on('message', (message: string, isBinary) => {
                handleClientMessage(message, isBinary)
            });
            
            if (webSocket.protocol === "presenter") {
                const newGame = {
                    presenterWebSocket: webSocket,
                    playerWebSockets: new Array<PlayerWebSocket>,
                } as Game;
                games.set(newGameIndex, newGame);
                var response = {
                    type: MessageType.GameIndex,
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
                        type: MessageType.PlayerId,
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
            if (message.type === MessageType.AddPlayer || message.type === MessageType.SubmitAssignmentDoodle || message.type === MessageType.SubmitFirstGuess || message.type === MessageType.SubmitSecondGuess) {
                console.log("sending message to presenter");
                var game = games.get(message.gameIndex);
                if (game) {
                    let presenterWebSocket = game.presenterWebSocket;
                    msg = isBinary ? msg : msg.toString();
                    presenterWebSocket.send(msg);
                }
            }
            else if (message.type === MessageType.CreateDoodle || message.type === MessageType.WaitingForOtherPlayers || message.type === MessageType.MakeAGuess || message.type === MessageType.ChooseYourAnswer) {
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
