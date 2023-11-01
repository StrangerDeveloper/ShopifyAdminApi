const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res)=>{
  res.send("Welcome to home page of Shopify admin Api's!");
});

router.get('/products/:locationId', async (req, res)=>{
    try {
        
    const shopifyStoreUrl = 'https://quickstart-1771f3bd.myshopify.com/admin/api/2023-10';
    const apiKey = 'b8293503bf87d0100018e60a8c05ba57';
    const apiPassword = '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';
    const locationId = req.params.locationId;
    //const locationId = req.body.locationId;

    const inventoryResponse = await axios.get(
        `${shopifyStoreUrl}/inventory_levels.json?location_ids=${locationId}`,
        {
          auth: {
            username: apiKey,
            password: apiPassword,
          },
        }
      );

     //console.log(`LocationInventory: ${inventoryResponse.data.inventory_levels.length}`);
      //var length = inventoryResponse.data.inventory_levels.length;
      //console.log('Inventory Response:', inventoryResponse);
      //console.log('Data Property:', inventoryResponse.data);
      //console.log('Inventory Levels Array:', inventoryResponse.data.inventory_levels);
      //console.log('Array Length:', inventoryResponse.data.inventory_levels.length);
      
      if(inventoryResponse && inventoryResponse.data.inventory_levels.length > 0){
      const inventoryItemIds = inventoryResponse.data.inventory_levels.map((level) => level.inventory_item_id);
      console.log(inventoryItemIds.length);
      //if(inventoryItemIds > 0){
    // Get products associated with inventory items
    const productsResponse = await axios.get(
      `${shopifyStoreUrl}/products.json?inventory_item_ids=${inventoryItemIds.join(',')}`,
      {
        auth: {
          username: apiKey,
          password: apiPassword,
        },
      }
    );

    const products = productsResponse.data.products;
    res.json({success: true, message: "Successful", totalInventory:inventoryResponse.data.inventory_levels.length,  totalProducts: products.length,  inventoryResponse:inventoryResponse.data, products:products});
      }else{
        res.status(404).json({ error: 'No Inventory found on specified location' });
      }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch products ${error}` });
  }

});

module.exports = router;