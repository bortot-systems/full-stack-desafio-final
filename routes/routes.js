const express = require('express');
const transactionRouter = express.Router();

const TransactionModel = require('../models/TransactionModel.js')


//RETRIEVE ALL
transactionRouter.get('/', async (req,res) => {
  try{
    const transaction = await TransactionModel.find({});    
    res.send(transaction);
  } catch (error){
    res.status(500).send(error);
  }
});

//RETRIEVE year/month
transactionRouter.get('/:year/:month', async (req,res) => {
  try{   
    const { year, month } = req.params;
    console.log(req.params.year);
    console.log(req.params.month);
    if (!year || !month) {
      return res.status(400).json({ error: 'Parâmetros inválidos' });
    }    
    const transaction = await TransactionModel.find({year, month});   
    res.send(transaction);
  } catch (error){
    res.status(500).send(error);
  }
});

//CREATE
transactionRouter.post('/add', async (req,res) => {
  try{
    const transaction = new TransactionModel(req.body);
    await transaction.save();
    res.send(transaction);
  } catch (error){
    res.status(500).send(error);
  }
});

//UPDATE
transactionRouter.patch('/update/:id', async (req,res) => {
  try{
    const id = req.params.id;
    const data = req.body;

    const transaction = await TransactionModel.findByIdAndUpdate(
      {_id: id}, 
      {$set: 
        {"year":req.body.year,
         "month":req.body.month,
         "day":req.body.day,
         "description":req.body.description,
         "category":req.body.category,
         "value":req.body.value
        }, 
      }, 
      {new:true} 
    );

    res.send(transaction);
  } catch (error){
    res.status(500).send(error);
  }
});

//DELETE
transactionRouter.delete('/delete/:id', async (req,res) => {
  try{
    const id = req.params.id;
    const transaction = await TransactionModel.findByIdAndDelete({_id: id});
    if (!transaction){
      res.status(400).send('Documento não encontrado na coleção');
    }
    else{
      res.send(200);
    }
  } catch (error){
    res.status(500).send(error);
  }
});

module.exports = transactionRouter;

