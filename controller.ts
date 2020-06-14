import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid4 } from 'uuid';
import {users, sess, sessToken} from './model';

const jwtSecret = process.env.JWTKEY || "test";

export const login = (req: express.Request, res: express.Response) => {
    const id = req.body.id;
    const uuid = uuid4();
    const info: sess = {
        id: id,
        key: uuid,
        lastConn: new Date()
    };
    users.push(info);
    const token = jwt.sign(info, jwtSecret, {expiresIn: 6 * 60 * 60 * 1000}); // 6 hours
    return res.status(200).json({
        id: id,
        token: token,
        key: uuid
    });
}

export const pwCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if(req.body.pass !== 'zero100') {
        return res.status(403).json({
            authorize: false,
            reason: 'invalid password'
        });
    }
    next();
}

export const sessCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers["x-access-token"] || req.headers["X-Access-Token"] ;
    try {
        if(typeof token !== 'string') throw Error("no Token");
        const ans = <sessToken>jwt.verify(token, jwtSecret);
        req.user = ans;
        const target = users.find((it: sess) => it.key === ans.key);
        if(target) target.lastConn = new Date();
    } catch(err) {
        return res.status(400).json({
            error: true,
            reason: JSON.stringify(err)
        });
    }
    next();
};

export const logout = (req: express.Request, res: express.Response) => {
    const token = req.headers["x-access-token"] || req.headers["X-Access-Token"];
    try {
        if(typeof token !== 'string') throw Error("no Token");
        const ans = <sess>jwt.verify(token, jwtSecret);
        const eraseIdx = users.findIndex((it) => { return it.key === ans.key });
        users.splice(eraseIdx, 1);
        return res.status(200).json({
            "logout": "true"
        })
    } catch(err) {
        res.status(400).json({
            error: true,
            reason: err
        });
    }
};
