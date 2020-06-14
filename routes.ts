import express from 'express';
import {pwCheck, sessCheck, login, logout} from './controller';
import {users, sess, recentMsg} from './model';

const Router = express.Router();

Router.post('/login', pwCheck, login);

Router.get('/recent', sessCheck, (_req: express.Request, res: express.Response) => {
    return res.status(200).json(recentMsg);
});

Router.get('/friends', sessCheck, (req: express.Request, res: express.Response) => {
    const list = users.filter((it: sess) => (it.key !== req.user!.key));
    return res.status(200).json(list);
});

Router.post('/logout', pwCheck, sessCheck, logout);

export default Router;
