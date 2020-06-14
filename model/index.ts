import ws from 'ws';

export interface sess {
    id: string,
    key: string,
    lastConn: Date
}

export interface sessToken {
    id: string,
    key: string
}

export interface chatReq {
    from: string,
    msg: string
}

export const users: sess[] = [];

export const wsSess: Map<String, ws> = new Map();

export const recentMsg: string[] = [];

export const addRecentMsg = (msg: string) => {
    if(recentMsg.length >= 10) {
        recentMsg.pop();
    }
    recentMsg.unshift(msg);
};
