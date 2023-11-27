const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

const http = require('http'); 

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const userRoute = require('./rotas/usuario_rota');
app.use("/api/usuario", userRoute);

const bandRoute = require('./rotas/banda_rota');
app.use('/api/bands', bandRoute);

const server = http.createServer(app); // Crie um servidor HTTP usando o Express

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
}); 

server.listen(port, () => {
  console.log(`App executando na porta: ${port}...`)
});

module.exports = { io };
