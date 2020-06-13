import ws from 'ws';
import Axios, { AxiosResponse } from 'axios';

console.log("client: ", process.argv[2]);

Axios.post('http://localhost:5000/login', {
    id: process.argv[2],
    pass: "zero100"
})
  .then((res: AxiosResponse) => {
    // logoutTest(res);
    friendsTest(res);
    // chatTest(res);
  });

const logoutTest = (ctx: AxiosResponse) => {
    Axios.post('http://localhost:5000/logout', {"pass": "zero100"}, {headers: {"X-Access-Token": ctx.data.token}});
};

const friendsTest = (ctx: AxiosResponse) => {
    console.log(ctx.data.token);
    Axios.get('http://localhost:5000/friends', {headers: {"X-Access-Token": ctx.data.token}})
      .then((res: AxiosResponse) => {
          console.log(JSON.stringify(res.data));
      })
      .catch((err) => {
          console.log(err.response.data);
      });
};

const chatTest = (ctx: AxiosResponse) => {
    const cli = new ws('ws://localhost:4000', {
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