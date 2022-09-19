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
 
apiRouter.get (endpoint + 'produtos', function (req, res) { 
  knex.select('*').from('produto') 
  .then( produtos => res.status(200).json(produtos) ) 
  .catch(err => { 
    res.status(500).json({ message: 'Erro ao recuperar produtos - ' + err.message }) 
  })   
})

apiRouter.get(endpoint + 'produtos/:id', (req, res) => { 
  const id = req.params.id;
  knex.select('*').from('produto').where({id}).first()
  .then(produto => res.status(200).json(produto))
  .catch(err => res.status(500).json({ message: 'Erro ao recuperar produto - ' + err.message }))
}) 

apiRouter.post(endpoint + 'produtos', (req, res) => { 
  const produto = req.body;
  knex('produto').insert(produto, ['id', 'nome', 'valor'])
  .then(produto => res.status(201).json(produto))
  .catch(err => res.status(500).json({ message: 'Erro ao inserir produto - ' + err.message }))
}) 

apiRouter.put(endpoint + 'produtos/:id', (req, res) => { 
  const id = req.params.id;
  const produto = req.body;
  knex('produto')
  .where({id})
  .update(produto)
  .then(p => res.status(200).json(p))
  .catch(err => res.status(500).json({ message: 'Erro ao atualizar produto - ' + err.message }))
}) 

apiRouter.delete(endpoint + 'produtos/:id', (req, res) => { 
  const id = req.params.id;
  knex('produto').where({id}).delete()
  .then(deleted => res.status(204).json(deleted))
  .catch(err => res.status(500).json({ message: 'Erro ao deletar produto - ' + err.message }))
}) 
 
module.exports = apiRouter; 