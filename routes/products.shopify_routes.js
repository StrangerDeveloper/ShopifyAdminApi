const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/products/:locationId', async (req, res)=>{
    try {
        
    const shopifyStoreUrl = 'https://quickstart-1771f3bd.myshopify.com/admin/api/2023-10';
    const apiKey = 'b8293503bf87d0100018e60a8c05ba57';
    const apiPassword = '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';
    const locationId = req.params.locationId;

    const inventoryResponse = await axios.get(
        `${shopifyStoreUrl}/inventory_levels.json?location_ids=${locationId}`,
        {
          auth: {
            username: apiKey,
            password: apiPassword,
          },
        }
      );

      const inventoryItemIds = inventoryResponse.data.inventory_levels.map((level) => level.inventory_item_id);

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
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }

});

module.exports = router;