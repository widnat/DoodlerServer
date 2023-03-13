import WebSocket = require("ws");

export type Game = {
    presenterWebSocket: WebSocket;
    childrenWebSockets: WebSocket[];
}

export type Message = {
    type: string;
    value: string;
}

export type Connection = {
    webSocketType: string;
    gameIndex: number;
}

export type AddPlayerUpdate = {
    name: string;
    imageUrl: string;
}