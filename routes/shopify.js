//import '@shopify/shopify-api/adapters/node';
//import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
//import express from 'express';
import shopifyApi from '@shopify/shopify-api'; 
import express, { json } from 'express';

const shopify = shopifyApi({
    apiKey: 'b5ea91d54456ca9170378dc93f54e32d',
  apiSecretKey: 'c181158acc3d0f94d78fd777aeb4e7bc',
  //scopes: ['read_products'],
  hostName: 'quickstart-1771f3bd',

});

const client = shopify.clients.Rest({session});
const response = client.get({path: 'quickstart-1771f3bd'});
console.log(response);

const app =  express();

app.use(json());

app.listen(3000, ()=>{
    console.log(`Server started on ${3000}`);
});