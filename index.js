const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
// const cors = require('cors');
// app.use(cors());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');

  next();
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const userRoute = require('./rotas/usuario_rota');
app.use("/api/usuario", userRoute);

const bandRoute = require('./rotas/banda_rota');
app.use('/api/bands', bandRoute);


app.listen(port, () => {
  console.log(`App executando na porta: ${port}...`)
})
