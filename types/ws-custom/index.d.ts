import http from 'http';

declare module 'ws-custom' {
    export interface wsIncomingMessage extends http.IncomingMessage {
        user: string;
    }
}
