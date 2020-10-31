const mongoose = require('mongoose');

//schema são as propriedades que irão compor a estrutura do documento no banco de dados, aqui podemos definir os tipos de valores, nomes dos campos, entre outras configurações.

//New mongoose.Schema é o comando utilizado para que possamos criar um novo Schema do mongo chamado TarefasSchema, através do mongoose.

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