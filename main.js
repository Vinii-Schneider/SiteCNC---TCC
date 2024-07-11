const express = require('express');
const bodyParser = require('body-parser');
const five = require('johnny-five');
const appExpress = express();
appExpress.use(bodyParser.json());
let led;
let estadoled = false;
appExpress.post('/ligaled', (req, res) => {
  if (led && req.body.estadoled) {
    led.on();
    estadoled = true;
    res.sendStatus(200);
  } 
  else {
    res.sendStatus(500);
  }
});
appExpress.post('/desligaled', (req, res) => {
  if (led && !req.body.estadoled) {
    led.off();
    estadoled = false;
    res.sendStatus(200);
  } 
  else {
    res.sendStatus(500);
  }
});
const server = appExpress.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
const board = new five.Board({
  repl: false
});
board.on('ready', function () {
  console.log('Arduino pronto');
  led = new five.Led(13);
});
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
    });
});