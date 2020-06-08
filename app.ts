import express from 'express';
import ws from 'ws';

const wsServer = new ws.Server({ port: 4000 });

var sessions: ws[] = [];

wsServer.on('connection', function connection(ws: ws) {
    sessions.push(ws);    
    ws.on('message', function incoming(message: string) {
        console.log('received: %s', message);
        sessions.forEach((item: ws) => {
            item.send(message);
        });
    });

    ws.on('close', function close() {
        sessions.forEach((item: ws, idx: number) => {
            if(item === ws) {
                sessions.splice(idx, 1);
            }
        });
    });
    
    ws.send("init");
})

const app = express();

app.all('/', (_req: express.Request, res: express.Response) => {
    return res.status(200).send('back server');
});

app.listen(3000, () => {
    console.log("REST server init");
});
