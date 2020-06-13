import express from 'express';
import ws from 'ws';
import bodyParser from 'body-parser';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';
import wsServer from './chatsocket';

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
    ws: ws | undefined
}

const sess: sess[] = [];

wsServer();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.all('/', (_req: express.Request, res: express.Response) => {
    return res.status(200).send('back server');
});

app.post('/login', (req: express.Request, res: express.Response) => {
    if(req.body.pass !== 'zero100') {
        return res.status(403).json({
            authorize: false,
            reason: 'invalid password'
        });
    }
    const id = req.body.id;
    const uuid = uuid4();
    const info: sess = {
        id: id,
        key: uuid,
        ws: undefined
    };
    sess.push(info);
    const token = jwt.sign(info, jwtSecret, {expiresIn: 6 * 60 * 60 * 1000}); // 6 hours
    return res.status(200).json({
        id: id,
        token: token,
        key: uuid
    });
});

app.get('/friends', (req: express.Request, res: express.Response) => {
    const token = req.headers["x-access-token"] || req.headers["X-Access-Token"] ;
    try {
        console.log(req.headers);
        if(typeof token !== 'string') throw Error("no Token");
        const ans = <sess>jwt.verify(token, jwtSecret);
        console.log("ok");
        const list = sess.filter((it: sess) => (it.key !== ans.key));
        return res.status(200).json(list);
    } catch(err) {
        res.status(400).json({
            error: true,
            reason: JSON.stringify(err)
        });
    }
});

app.post('/logout', (req: express.Request, res: express.Response) => {
    if(req.body.pass !== 'zero100') {
        return res.status(403).json({
            authorize: false,
            reason: 'invalid password'
        });
    }
    const token = req.headers["x-access-token"] || req.headers["X-Access-Token"];
    try {
        if(typeof token !== 'string') throw Error("no Token");
        const ans = <sess>jwt.verify(token, jwtSecret);
        const eraseIdx = sess.findIndex((it) => { return it.key === ans.key });
        sess.splice(eraseIdx, 1);
        return res.status(200).json({
            "logout": "true"
        })
    } catch(err) {
        res.status(400).json({
            error: true,
            reason: err
        });
    }
});

app.listen(5000, () => {
    console.log("REST server init");
});
