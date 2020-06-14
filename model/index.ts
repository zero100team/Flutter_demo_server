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

class recentMsg {
    buffer: chatReq[] = [];
    
    add = (msg: string) => {
        const it = <chatReq>JSON.parse(msg);
        if(this.buffer.length >= 10) {
            this.buffer.splice(0, 1);
        }
        this.buffer.push(it);
    };
    
    list = () => {
        return this.buffer;
    }
}

export const msg = new recentMsg();
