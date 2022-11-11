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

  const deleteProductFromCart = async(productId) => {
    try {
      await axios.delete("/api/cart/" + productId);
    } catch(error) {
      setError("error adding product to cart: " + error);
    }
  }
  
  const decrementOneProduct = async(cartProduct) => {
    try {
      if(cartProduct.quantity <2) {
        //delete the product
        await axios.delete("/api/cart/" + cartProduct.id);
      } else {
        // decrement it by one
        let newQuantity = cartProduct.quantity - 1;
        console.log("cartProduct.id: " + cartProduct.id + ", newQuantity: " + newQuantity)
        console.log("/api/cart/" + cartProduct.id + "/" + newQuantity)
        await axios.put("/api/cart/" + cartProduct.id + "/" + newQuantity);
      }
    } catch(error) {
      setError("error adding product to cart: " + error);
    }
  }
  
  const incrementOneProduct = async(cartProduct) => {
    try {
      let newQuantity = cartProduct.quantity + 1;
      console.log("cartProduct.id: " + cartProduct.id + ", newQuantity: " + newQuantity)
      console.log("/api/cart/" + cartProduct.id + "/" + newQuantity)
      await axios.put("/api/cart/" + cartProduct.id + "/" + newQuantity);
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
  const deleteFromCart = async(productId) => {
    await deleteProductFromCart(productId);
    fetchCart();
  }
  const decrementCartProduct = async(cartProduct) => {
    await decrementOneProduct(cartProduct);
    fetchCart();
  }
  const incrementCartProduct = async(cartProduct) => {
    await incrementOneProduct(cartProduct);
    fetchCart();
  }
  
  return (
    <div className="page">
      {error}
      <div className="flex-container">
        <div className="column">
          <h1>Products</h1>
          {products.map( product => (
            <div className="row" key={product.id}>
              <p>{product.name + ", " + product.price}</p>
              <button onClick={e => addToCart(product.id)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <div className="column">
          <h1>Cart</h1>
          {cart.map( cartProduct => (
            <div className="row" key={cartProduct.id}>
              <p>{(products.find(element => element.id === cartProduct.id)).name + ", " + cartProduct.quantity}</p>
              <button onClick={e => decrementCartProduct(cartProduct)}>-</button>
              <button onClick={e => incrementCartProduct(cartProduct)}>+</button>
              <button onClick={e => deleteFromCart(cartProduct.id)}>Remove from Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
