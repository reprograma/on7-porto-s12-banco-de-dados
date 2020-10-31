# ReprogramaAPI

API para as aulas de BackEnd da Reprograma

## Introdução ao Mongo

O mongo é um banco de dados NoSQL. Através dele conseguimos trabalhar com a estrutura em formato de documentos.

### Estrutura do Mongo

Um banco de dados do mongo é constituído pela estrutura de Banco de Dados, Collections e Documentos.

### MVC

A arquitetura padrão MVC é composta por Model, View e Controller, que representam:
```
    Model: parte da aplicação que que terá os contratos de para conexão com os bancos de dados ou com outras estruturas relacionadas.
    View: basicamente são as estruturas que o cliente verá, tudo aquilo que estará disponível para interação com o cliente.
    Controller: a lógica da aplicação, essa por sua vez faz a junção, entre o model e a view, pegando dados através dos models e direcionando-os a view, para interação com os usuários.
```
No nosso servidor, não teremos a estrutura View, porém teremos as nossas rotas que conterão as estruturas da nossa url para a chamada dos métodos HTTP.

### Querys no Mongo

FIND - utilizamos esse comando para buscar registros dentro das collections do nosso banco de dados.

```
   Model.find(function (err, objRetornado) {
   //caso apresente algum erro
      if (err) res.status(500).send(err);
   //caso de sucesso retornar o objeto com o retorno encontrado
      res.status(200).send(objRetornado);
    })
```


FINDBYID - utilizamos esse comando para buscar registros dentro das collections do nosso banco de dados, utilizando como parâmetro de busca o id gerado pelo mongo.

```
   Model.findById(id, function (err, objRetornado) {
   //caso apresente algum erro
      if (err) res.status(500).send(err);
   //caso de sucesso retornar o objeto com o retorno encontrado
      res.status(200).send(objRetornado);
    })
```

UPDATE - utilizamos esse comando para atualizar registros dentro das collections do nosso banco de dados.

```
    Model.update(
    //parâmetro de busca, utilizando nesse caso é o id
      { "_id": id de busca no banco},
      { $set: {
        nome: "joao",
        idade: 13,
        ...
      } },
      { upsert: true },
      function (err) {
      //caso apresente algum erro 
        if (err) res.status(500).send({ message: err.message });
        //caso consiga atualizar com sucesso
        res.status(201).send({ message: "Atualizado com sucesso!" });
      })
```

REMOVE - utilizamos esse comando para remover registros de dentro da collection, de acordo com filtro especificado.

```
   Model.remove(function (err, objRetornado) {
   //caso apresente algum erro
   if (!err) {
    //caso sucesso ao remover
          res.status(204).send({ message: 'removido com sucesso...' });
        } else {
          res.status(500).send({ message: "Erro ao remover" });
    })
```

SAVE - utilizamos esse comando para buscar registros dentro das collections do nosso banco de dados, utilizando como parâmetro de busca o id gerado pelo mongo.

```
 Model.save(function (err) {
      if (err) res.status(500).send({ message: err.message });
      else {
      //caso salve o registro com sucesso
        res.status(201).send(model.toJSON());
      }
    });
```
### Mongoose

Biblioteca do NodeJs que permite conexão com o banco de dados do MongoDB, criar modelos e esquemas, bem como utilizar comandos/consultas do mongo para manipulação dos dados.

Instalação do mongoose no projeto:
```
npm install mongoose
```

Após realizar a instalação, iremos utilizá-lo criando uma instância através da pasta app.js do projeto, desta forma:
```
const mongoose = require("mongoose")
```

Logo em seguida, precisaremos criar a string de conexão com o banco de dados Mongo, seja ele local ou uma conexão com um banco hospedado em algum servidor, tal como por exemplo: Mlab.

```
mongoose.connect("mongodb://localhost:27017/reprograma",  { useNewUrlParser: true });
```

Para que consigamos ter uma visibilidade de erros caso a conexão com o banco de dados falhe, recomendamos colocar essas tratativas:

```
let db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"))
db.once("open", function (){
  console.log("conexão feita com sucesso.")
})
```

### Alterar os aquivos mockados para consultar direto do Banco de Dados 

1º - Utilizaremos a estrutura model dentro da pasta do nosso projeto e iremos substituir a chamada de um arquivo json para uma busca direto ao banco de dados, para isso:
```
const mongoose = require('mongoose');

//schema são as propriedades que irão compor a estrutura do documento no banco de dados, aqui podemos definir os tipos de valores, nomes dos campos, entre outras configurações.

//New mongoose.Schema é o comando utilizado para que possamos criar um novo Schema do mongo chamado AlunasSchema, através do mongoose.

const TarefasSchema = new mongoose.Schema({
    id : { type : Number},
    descricao: { type: String },
    dataInclusao: { type: String },
    concluido: { type: Boolean },
    nomeColaboradora: { type: String }
},{
    versionKey: false
});

const Tarefas = mongoose.model('Tarefas', TarefasSchema);

module.exports = Tarefas;
```

2º - Criar uma instância do banco de dados a partir do schema criado para as Alunas:

```
const Tarefas = require('../models/tarefas');
```
### Alterar as chamadas dos métodos HTTP dentro da Controller para consumir o banco de dados

```
const getAll = (req, res) => {
  console.log(req.url);
    Tarefas.find(function (err, tarefas) {
      res.status(200).send(tarefas);
    })
};

const getById = (req, res) => {
  const id = req.params.id;
    Tarefas.find({ id}, function(err, tarefa) {
        res.status(200).send(tarefa);
    })  
};

const postTarefa = (req, res) => {
  console.log(req.body);

  let tarefa = new Tarefas(req.body);
    tarefa.save(function(err){
    if (err) res.status(500).send({ message: err.message })

    res.status(201).send(tarefa.toJSON());
  })
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;
  try {
    Tarefas.find({ id }, function(err, tarefa){
        if(tarefa.length > 0){
            Tarefas.deleteMany({ id }, function (err) {
                if (!err) {
                  res.status(200).send({ message: 'Tarefa removida com sucesso', status: "SUCCESS" })
                }
              })
        }else res.status(200).send({ message: 'Não há tarefa para ser removida', status: "EMPTY" })
    })
  } catch (err) {
    console.log(err)
    return res.status(424).send({ message: err.message })
  }
};

const deleteTarefaConcluida = (req, res) => {
    
    try {
        Tarefas.deleteMany({ concluido: true }, function (err) {
            if (!err) {
                res.status(200).send({ message: 'Tarefas concluidas removidas com sucesso', status: "SUCCESS" })
            }
        })
      } catch (err) {
        console.log(err)
        return res.status(424).send({ message: err.message })
      }
}

const putTarefa = (req, res) => {
  const id = req.params.id;

  try {
    
    Tarefas.update(
        { id },
        { $set: req.body },
        function (err) {
        res.status(201).send({ message: "Tarefa atualizada com sucesso!" });
    })

  } catch (err) {
    return res.status(424).send({ message: err.message });
  }
}
```
Order de alteração/criação de rotas:

### 1º - / (get)
### 2º - tarefas/ (get)
### 3º - tarefas/:id (get)
### 6º - tarefas/ (post)
### 7º - tarefas/:id (delete)
### 7º - tarefas/ (delete)
### 8º - tarefas/:id (put)

router.delete("/:id", controller.deleteTarefa);
router.delete("/", controller.deleteTarefaConcluida);
router.put("/:id", controller.putTarefa);
