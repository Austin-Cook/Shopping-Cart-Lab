const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

let products = [];
let id = 0;
let cart = [];

// PRODUCTS
// GET all products
app.get('/api/products', (req, res) => {
  res.send(products);
});

// GET a product at id
app.get('/api/products/:id', (req, res) => {
  let id = parseInt(req.params.id);
  res.send(products.find(element => element.id = id));
});

// Create (post) a product)
app.post('/api/products', (req, res) => {
  id = id + 1;
  let product = {
    id: id,
    name: req.body.name,
    price: req.body.price
  };
  products.push(product);
  res.send(product);
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = products.map(product => {
      return product.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  products.splice(removeIndex, 1);
  res.sendStatus(200);
});

// CART
// GET products in the cart
app.get('/api/cart', (req, res) => {
  res.send(cart);
});

// Add product to the cart
app.post('/api/cart/:id', (req, res) => {
  // check if item is in the cart
  let id = parseInt(req.params.id);
  let findIndex = cart.map(product => {
      return product.id;
    })
    .indexOf(id);
  if (findIndex === -1) {
      // if not in the cart, create a new item with with count of 1
      let cartProduct = {
        id: id,
        quantity: 1
        };
      cart.push(cartProduct);
      res.send(cartProduct);
  } else {
      // if it is in the cart - increase it's count
      cart[findIndex].quantity = cart[findIndex].quantity + 1;
      res.send(cart[findIndex]);
  }
});
  
// Update quantity of an item
app.put('/api/cart/:id/:quantity', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = cart.map(product => {
    return product.id;
  });
  let index = itemsMap.indexOf(id);
  if (index === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  let cartProduct = cart[index];
  cartProduct.quantity = parseInt(req.params.quantity);
  res.send(cartProduct);
});

// Delete an item from the cart
app.delete('/api/cart/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = cart.map(cartProduct => {
      return cartProduct.id;
    })
    .indexOf(id);
  if (removeIndex === -1) {
    res.status(404)
      .send("Sorry, that item doesn't exist");
    return;
  }
  cart.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'));