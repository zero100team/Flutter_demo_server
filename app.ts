import express from 'express';
import ws from 'ws';

const wsServer = new ws.Server({ port: 4000 });

wsServer.on('connection', function connection(ws: ws) {
    
    ws.on('message', function incoming(message: string) {
        console.log('received: %s', message);
        ws.send(message);
    })
    
    ws.send("init");
})

const app = express();

app.all('/', (_req: express.Request, res: express.Response) => {
    return res.status(200).send('back server');
});

app.listen(3000, () => {
    console.log("REST server init");
});
