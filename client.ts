import ws from 'ws';
import Axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname + './.env.test')});

console.log("client: ", process.argv[2]);

const url = process.env.APIURL || 'http://localhost:5000';
const wsUrl = process.env.WSURL || 'http://localhost:4000';

Axios.post(`${url}/login`, {
    id: process.argv[2],
    pass: "zero100"
})
  .then((res: AxiosResponse) => {
    // logoutTest(res);
    // friendsTest(res);
    chatTest(res);
  });

const logoutTest = (ctx: AxiosResponse) => {
    Axios.post(`${url}/logout`, {"pass": "zero100"}, {headers: {"X-Access-Token": ctx.data.token}});
};

const friendsTest = (ctx: AxiosResponse) => {
    console.log(ctx.data.token);
    Axios.get(`${url}/friends`, {headers: {"X-Access-Token": ctx.data.token}})
      .then((res: AxiosResponse) => {
          console.log(JSON.stringify(res.data));
      })
      .catch((err) => {
          console.log(err.response.data);
      });
};

const chatTest = (ctx: AxiosResponse) => {
    const cli = new ws(wsUrl, {
        headers: {
            token: ctx.data.token
        }
    });

    cli.on('open', function open() {
        console.log("client open");
    });

    cli.on('message', (data: string) => {
        console.log(data);
    });

    let count = 0;

    setInterval(() => {
        cli.send(JSON.stringify({from: ctx.data.key, to: process.argv[3], msg: `Hello from ${process.argv[2]}`}));
        count+=1;
    }, 1000);
}
