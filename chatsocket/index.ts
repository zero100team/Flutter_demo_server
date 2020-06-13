import ws from 'ws';
import jwt from 'jsonwebtoken';
import { wsIncomingMessage } from 'ws-custom';

const jwtSecret = "test";

interface friend {
    friendId: Number,
    name: String,
    statusMsg: String,
    music: String,
    musician: String
}

interface sess {
    id: string,
    key: string,
    ws: ws | undefined,
    friends: friend[]
}

interface chatReq {
    from: string, // key
    to: string, // key
    msg: string
}

var wsSess: Map<String, ws> = new Map();

const run = () => {
const wsServer = new ws.Server({ 
    port: 4000,
    verifyClient: function(info, cb) {
        var token = info.req.headers.token;
        if(typeof token !== 'string') {
            cb(false, 401, 'unauthorized');
        }
        else {
            jwt.verify((token as string), jwtSecret, (err, decoded) => {
                if(err) { 
                    cb(false, 401, 'unauthorized'); 
                }
                try {
                    const user = decoded as sess;
                    (info.req as wsIncomingMessage).user = user.key;
                    cb(true);
                } catch(err) {
                    console.log(err);
                    cb(false, 401, "unauthorized");
                }
            });
        }
    }
});

wsServer.on('connection', function connection(ws: ws, _request: wsIncomingMessage) {
    if(!_request.user) { return; }
    console.log(_request.user);
    wsSess.set(_request.user, ws);
    
    ws.on('message', function incoming(message: string) {
        try {
            const req = JSON.parse(message) as chatReq;
            const target = wsSess.get(req.to);
            if(target) {
                target.send(message);
            }
            ws.send(message);
        } catch(err) {
            ws.send({error: true, reason: JSON.stringify(err)});
        }
    });

    ws.on('close', function close() {
        wsSess.delete(_request.user);
    });
    
    ws.send("init");
});
}

export default run;
