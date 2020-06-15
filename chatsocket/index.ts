import ws from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import {users, sess, wsSess, msg} from '../model';

const jwtSecret = "test";

function sendAll(from: string, msg: string) {
    wsSess.forEach((it: ws, key: String) => {
        if(key !== from) it.send(msg);
    });
}

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
                        info.req.user = user;
                        cb(true);
                    } catch(err) {
                        console.log(err);
                        cb(false, 401, "unauthorized");
                    }
                });
            }
        }
    });

    wsServer.on('connection', function connection(ws: ws, _request: http.IncomingMessage) {
        if(!_request.user) { return; }
        wsSess.set(_request.user.key, ws);
        
        ws.on('message', function incoming(message: string) {
            if(!_request.user) { return; }
            try {
                const target = users.find((it: sess) => (it.key === _request.user!.key));
                target!.lastConn = new Date();
                ws.send(message);
                msg.add(message);
                sendAll(_request.user!.key, message);
            } catch(err) {
                ws.send({error: true, reason: JSON.stringify(err)});
            }
        });

        ws.on('close', function close() {
            if(_request.user) wsSess.delete(_request.user.key);
        });
    });

    killSleep();
    setInterval(killSleep, 1000 * 60 * 5);
}

const killSleep = () => {
    console.log("Up Sessions : ", wsSess.size);
    wsSess.forEach((ws: ws, key: String) => {
        const look = users.find((it: sess) => it.key === key)?.lastConn;
        if(!look || (new Date()).getTime() - look.getTime() > 1000 * 60 * 10) {
            ws.close();
        }
    });
}

export default run;
