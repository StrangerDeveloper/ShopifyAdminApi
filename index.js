const express = require("express");

const app =  express();

const PORT = process.env.PORT || 3000;

const client = new shopify.clients.Rest({session});
const response = client.get({path: 'shop'});


// app.listen(PORT, ()=>{
//     console.log(`Server started on ${PORT}`);
// });