const express = require ('express') 
const knex = require('knex')({ 
  client: 'pg', 
  debug: true, 
  connection: { 
      connectionString : process.env.DATABASE_URL, 
      ssl: { rejectUnauthorized: false }, 
    } 
}); 

let apiRouter = express.Router()  
const endpoint = '/'
 
apiRouter.get (endpoint + 'clientes', function (req, res) { 
  knex.select('*').from('cliente') 
  .then( clientes => res.status(200).json(clientes) ) 
  .catch(err => { 
    res.status(500).json({ message: 'Erro ao recuperar clientes - ' + err.message }) 
  })   
})

apiRouter.get(endpoint + 'clientes/:id', (req, res) => { 
  const id = req.params.id;
  if (id < 1) {
    return res.status(500).json({ message: 'ID Inválido'})
  }
  knex.select('*').from('cliente').where({id}).first()
  .then(cliente => res.status(200).json(cliente))
  .catch(err => res.status(404).json({ message: 'Cliente não encontrado - ' + err.message }))
}) 

apiRouter.post(endpoint + 'clientes', (req, res) => { 
  const cliente = req.body;
  knex('cliente').insert(cliente, ['id', 'nome'])
  .then(cliente => res.status(201).json(cliente))
  .catch(err => res.status(500).json({ message: 'Erro ao inserir cliente - ' + err.message }))
}) 

apiRouter.put(endpoint + 'clientes/:id', (req, res) => { 
  const id = req.params.id;
  const cliente = req.body;
  if (id < 1) {
    return res.status(500).json({ message: 'ID Inválido'})
  }
  knex('cliente')
  .where({id})
  .update(cliente)
  .then(p => res.status(200).json(p))
  .catch(err => res.status(500).json({ message: 'Erro ao atualizar cliente - ' + err.message }))
}) 

apiRouter.delete(endpoint + 'clientes/:id', (req, res) => { 
  const id = req.params.id;
  if (id < 1) {
    return res.status(500).json({ message: 'ID Inválido'})
  }
  knex('cliente').where({id}).delete()
  .then(deleted => res.status(204).json(deleted))
  .catch(err => res.status(500).json({ message: 'Erro ao deletar cliente - ' + err.message }))
}) 
 
module.exports = apiRouter; 