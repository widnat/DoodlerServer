import WebSocket = require("ws");

export type Game = {
    presenterWebSocket: WebSocket;
    childrenWebSockets: WebSocket[];
}

export type Message = {
    type: string;
    gameIndex: number;
    value: string;
}

export type AddPlayerMessage = {
    name: string;
    imageUrl: string;
}