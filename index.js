//require('dotenv').config();

const express = require("express");
const shopifyApi = require('@shopify/shopify-api');
//const mongoose = require('mongoose');
//const routes = require('./routes/routes');
const shopifyRouter =  require('./routes/products.shopify_routes');

//const mongoString = process.env.DataBaseUrl;
//const mongoString = "mongodb+srv://ismmartPos:Ps7cho01@cluster0.ribk9op.mongodb.net/";
const PORT = process.env.PORT || 3000;

//import shopifyApi from '@shopify/shopify-api'; 
//import express, { json } from 'express';

const shopify = shopifyApi({
    apiKey: 'b5ea91d54456ca9170378dc93f54e32d',
  apiSecretKey: 'c181158acc3d0f94d78fd777aeb4e7bc',
  //scopes: ['read_products'],
  hostName: 'quickstart-1771f3bd',

});

const client = shopify.clients.Rest({session});
const response = client.get({path: 'quickstart-1771f3bd'});
console.log(response);


// mongoose.connect(mongoString);
// const database = mongoose.connection;

// database.on('error', (error) => {
//     console.log(error)
// });

// database.once('connected', () => {
//     console.log('Database Connected');
// });

const app =  express();

app.use(express.json());

//app.use('/api', routes);
app.use('/api', shopifyRouter);


// const product = await client.get({
//   path: `products/${productId}`,
//   query: {id: 1, title: "title"}
// });


app.listen(PORT, ()=>{
    console.log(`Server started on ${PORT}`);
});