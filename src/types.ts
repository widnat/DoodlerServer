import WebSocket = require("ws");

export type Game = {
    presenterWebSocket: WebSocket;
    playerWebSockets: PlayerWebSocket[];
}

export type PlayerWebSocket = {
    playerId: number;
    webSocket: WebSocket;
}

export type Message = {
    type: string;
    gameIndex: number;
    playerId: number;
    value: string;
}

export type AddPlayerMessage = {
    name: string;
    imageUrl: string;
}