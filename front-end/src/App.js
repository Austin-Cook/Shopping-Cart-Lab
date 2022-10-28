import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Error from './Error.js'
import Product from './Product.js'
import Cart from './Cart.js'

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);
  
  const fetchProducts = async() => {
    try {      
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch(error) {
      setError("error retrieving products: " + error);
    }
  }
  
  const fetchCart = async() => {
    try {      
      const response = await axios.get("/api/cart");
      setCart(response.data);
    } catch(error) {
      setError("error retrieving cart: " + error);
    }
  }
  
  const addProductToCart = async(productId) => {
    try {
      await axios.post("/api/cart/" + productId);
    } catch(error) {
      setError("error adding product to cart: " + error);
    }
  }

  // fetch products
  useEffect(() => {
    fetchProducts();
  },[]);
  useEffect(() => {
    fetchCart();
  },[]);

  
  const addToCart = async(productId) => {
    console.log("productId is: " + productId)
    await addProductToCart(productId);
    fetchCart();
    //console.log("Adding item to the cart")
  }
  
  return (
    <div className="page">
      {error}
      <div className="flex-container">
        <div className="column">
          <h1>Products</h1>
          {products.map( product => (
            <div key={product.id}>
              <p>{product.name + ", " + product.price}</p>
              <p>{product.id}</p>
              <button onClick={e => addToCart(product.id)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <div className="column">
          <h1>Cart</h1>
          {cart.map( cartProduct => (
            <div key={cartProduct.id}>
              <p>{(products.find(element => element.id === cartProduct.id)).name}</p>
              <button onClick={e => addToCart(product.id)}>-</button>
              <button onClick={e => addToCart(product.id)}>+</button>
              <button onClick={e => addToCart(product.id)}>Remove from Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
