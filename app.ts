import express from 'express';
import bodyParser from 'body-parser';
import wsServer from './chatsocket';

import Router from './routes';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname + './.env.prod')});

wsServer();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.all('/', (_req: express.Request, res: express.Response) => {
    return res.status(200).send('back server');
});

app.use(Router);

app.listen(5000, () => {
    console.log("REST server init");
});
