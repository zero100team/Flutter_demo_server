import ws from 'ws';

const cli = new ws('ws://localhost:4000');

cli.on('open', function open() {
    console.log("client open");
});

cli.on('message', (data: string) => {
    console.log(data);
});

let count = 0;

setInterval(() => {
    cli.send(`now${count}`);
    count+=1;
}, 1000);
