//const tarefas = require("../models/tarefas.json");
const Tarefas = require('../models/tarefas');
const fs = require("fs");

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

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa
};
