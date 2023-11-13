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
    const limit = req.params.limit;
    const fields =  req.params.fields;
    //const locationId = req.body.locationId;


  //   axios
  // .get(
  //   `${shopifyStoreUrl}/inventory_levels.json?location_ids=${locationId}`,
  //   {
  //     auth: {
  //       username: apiKey,
  //       password: apiPassword,
  //     },
  //   }
  // )
  // .then((inventoryResponse) => {
  //   const inventoryLevels = inventoryResponse.data.inventory_levels;
  //   const inventoryItemIds = inventoryLevels.map((level) => level.inventory_item_id);
  //     console.log(inventoryItemIds);
  //   const productPromises = inventoryItemIds.map((inventoryItemId) => {
  //     return axios.get(
  //       `${shopifyStoreUrl}/inventory_items/${inventoryItemId}/product.json`,
  //       {
  //         auth: {
  //           username: apiKey,
  //           password: apiPassword,
  //         },
  //       }
  //     );
  //   });
    
  //   // Use Promise.all to make concurrent requests for product data
  //   Promise.all(productPromises)
  //     .then((productResponses) => {
  //       const products = productResponses.map((response) => response.data.product);
  //       // Filter products to ensure they belong to the desired location
  //       const matchingProducts = products.filter((product) => {
  //         return product.variants.some((variant) => variant.inventory_item_id === inventoryItemId);
  //       });
    
  //       res.json(matchingProducts);
  //     })
  //     .catch((error) => {
  //       res.status(500).json({ error: `Failed to fetch products based on inventory items ${error}` });
  //     });
    
  // })
  // .catch((error) => {
  //   res.status(500).json({ error: `Failed to fetch inventory levels ${error}` });
  // });


   axios
    .get(
      `${shopifyStoreUrl}/products.json`,
      {
        auth: {
          username: apiKey,
          password: apiPassword,
        },
      }
    )
    .then((productsResponse) => {
      const products = productsResponse.data.products;
  
      // Extract variant IDs and inventory Items IDs
      const variantInventoryPairs = products.reduce((accumulator, product) => {
        const variants = product.variants;
        for (const variant of variants) {
          accumulator.push({
            variantId: variant.id,
            inventoryItemId: variant.inventory_item_id,
            productId: variant.product_id,
          });
        }
        return accumulator;
      }, []);

      console.log(variantInventoryPairs.length);
  
      //Continue with the next steps
      //const filteredVariants =
       variantInventoryPairs.filter((pair) => {
        return axios
          .get(
            `${shopifyStoreUrl}/inventory_levels.json?inventory_item_ids=${pair.inventoryItemId}`,
            {
              auth: {
                username: apiKey,
                password: apiPassword,
              },
            }
          )
          .then((inventoryResponse) => {
            const inventoryLevel = inventoryResponse.data.inventory_levels;
            //inventoryLevel.map((data)=> console.log(`LocationID: ${data.location_id}`));
            //console.log(`inventoryResponse: ${inventoryResponse.data.inventory_levels['location_id']}`);
            // Check if the location matches the desired location
            const inventoryLocationId =  inventoryLevel.map((data)=> data.location_id);
            if(inventoryLocationId == locationId){
            const matchedInventoryItemIds = inventoryLevel.filter((data)=>pair.inventoryItemId == data.inventory_item_id)
            .map((data)=> data.inventory_item_id);
                console.log(`MatchedItemsIds:  ${matchedInventoryItemIds}`);

      Promise.all(matchedInventoryItemIds)
      .then((results) => {
       
    
        // The 'results' array will contain boolean values indicating if the variant matches the location
        // Use the results to filter the product variants
        const matchingVariants = variantInventoryPairs.filter((pair, index) => pair.inventoryItemId == results[index].inventory_item_id);
       // matchingVariants.map();
       //console.log(matchingVariants);
        const matchingProductIds = matchingVariants.map((pair) => pair.variantId);
        console.log(`Matching: ${matchingProductIds }`);
        // Now, you can filter the products based on the matching product variant IDs
         const matchingProducts = //[];
        products.filter((product) => {
          return product.variants.some((variant) => matchingProductIds.includes(variant.id));
        });
    
         res.json({success: true, products:matchingProducts});
      })
      .catch((error) => {
        res.status(500).json({ error: `Failed to filter products by location ${error}` });
      });


                //const matchedProducts = products.filter()

                // const matchingProducts = products.filter((product) => {
                //   return product.variants.some((variant) => matchedInventoryItemIds.includes(variant.inventory_item_id));
                // });

                // console.log(`MatchedProduct: ${matchingProducts}`);
            
                
                
              //return matchedInventoryItemIds;

            }
            // //if(inventoryLocationId == locationId){
            //    const inventoryItemIdsList = inventoryLevel.map((data)=>{
            //       //console.log(`inventoryLocationID:${data.location_id == locationId} ${inventoryLocationId} ${data.inventory_item_id}`);
            //       if(pair.inventoryItemId == data.inventory_item_id && inventoryLocationId == locationId){
            //         //console.log(`inventoryItemID:${data.inventory_item_id} ${pair.productId}`);
            //         return data.inventory_item_id;
                 
            //       }
               
            //     });

            //     console.log(inventoryItemIdsList);

            // //}
            
            //res.json(inventoryResponse.data.inventory_levels);
            
            //return inventoryLocationId == locationId;
          })
          .catch((error) => {
           // res.status(500).json({ error: `Failed to fetch inventoryLevels ${error}` });
            // Handle errors for individual requests
            //to fetch inventory information for variant ID ${pair.inventoryItemId}, 
            console.error(`Failed Error: ${error}`);
            return [];
          });
      });
      
       //console.log(filteredVariants.length);
      // // Once all requests are completed, you can filter products based on location
      
    })
    .catch((error) => {
      res.status(500).json({ error: `Failed to fetch product variants ${error}` });
    });
  

      
//     const inventoryResponse = await axios.get(
//         `${shopifyStoreUrl}/inventory_levels.json?location_ids=${locationId}`,
//         {
//           auth: {
//             username: apiKey,
//             password: apiPassword,
//           },
//         }
//       );

//      //console.log(`LocationInventory: ${inventoryResponse.data.inventory_levels.length}`);
//       //var length = inventoryResponse.data.inventory_levels.length;
//       //console.log('Inventory Response:', inventoryResponse);
//       //console.log('Data Property:', inventoryResponse.data);
//       //console.log('Inventory Levels Array:', inventoryResponse.data.inventory_levels);
//       //console.log('Array Length:', inventoryResponse.data.inventory_levels.length);
      
//       if(inventoryResponse && inventoryResponse.data.inventory_levels.length > 0){
//       const inventoryItemIds = inventoryResponse.data.inventory_levels.map((level) => level.inventory_item_id);
//       //console.log(inventoryItemIds);
        
//       const productPromises = inventoryItemIds.map((inventoryItemId) => {
//         return axios.get(
//           `${shopifyStoreUrl}/inventory_items/${inventoryItemId}.json`,
//           {
//             auth: {
//               username: apiKey,
//               password: apiPassword,
//             },
//           }
//         );
//       });

//       console.log(productPromises);

//       // Use Promise.all to make concurrent requests for product data
// Promise.all(productPromises)
// .then((productResponses) => {
  
//   const products = productResponses.map((response) => response.data.inventory_item.product_id);
//   // Process the products as needed
//   res.json(products);
// })
// .catch((error) => {
//   res.status(500).json({ error: `Failed to fetch products! ${error}` });
// });


      //if(inventoryItemIds > 0){
    // Get products associated with inventory items
    // const productsResponse = await axios.get(
    //   `${shopifyStoreUrl}/products.json?inventory_item_ids=${inventoryItemIds}`,
    //   {
    //     auth: {
    //       username: apiKey,
    //       password: apiPassword,
    //     },
    //   }
    // );

    // const products = productsResponse.data.products;
    // res.json({success: true, message: "Successful", totalInventory:inventoryResponse.data.inventory_levels.length,  totalProducts: products.length,  inventoryResponse:inventoryResponse.data, products:products});
      // }else{
      //   res.status(404).json({ error: 'No Inventory found on specified location' });
      // }
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch products ${error}` });
  }

});

module.exports = router;