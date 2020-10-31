const express = require("express")
const bodyParser = require("body-parser")
//1 instalar mongoose
//2 colocar import do mongoose
const mongoose = require("mongoose")

const app = express()

//rotas
const index = require("./routes/index")
const tarefas = require("./routes/tarefasRoute")
const colaboradoras = require("./routes/colaboradorasRoute")

//adicionar string de conexão do mongo
mongoose.connect("mongodb://localhost:27017/reprograma",  { useNewUrlParser: true, useUnifiedTopology: true });

//configuração de configuração do mongo
let db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"))
db.once("open", function (){
  console.log("conexão feita com sucesso.")
})

//configurar body parser
app.use(bodyParser.json());
// app.use(express.json()); - Podemos usar a propria função de parser de json do express, sem a necessidade de instalar o body parser 

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
  })

app.use("/", index)
app.use("/tarefas", tarefas)
app.use("/colaboradoras", require("./routes/colaboradorasRoute"))

module.exports = app
