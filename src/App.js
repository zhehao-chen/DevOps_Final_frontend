import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // API endpoints - directly call backend services
  const PRODUCT_API = 'http://localhost:5001/api/products';
  const ORDER_API = 'http://localhost:5002/api/orders';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_API);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
      alert('Cannot load products. Make sure Product Service (port 5001) is running.');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    try {
      const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
      
      const order = {
        customer_email: 'customer@example.com',
        total_amount: total,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: 1,
          price: parseFloat(item.price)
        }))
      };

      const response = await fetch(ORDER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Order placed successfully! Order ID: ${data.order_id}`);
        setCart([]);
      } else {
        alert('Failed to create order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Cannot create order. Make sure Order Service (port 5002) is running.');
    }
  };

  if (loading) {
    return (
      <div className="App">
        <header>
          <h1>E-Commerce Demo</h1>
        </header>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>E-Commerce Demo v1.1.0</h1>
        <div className="cart-badge">Cart: {cart.length}</div>
      </header>
      
      <main>
        <section className="products">
          <h2>Products</h2>
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">${parseFloat(product.price).toFixed(2)}</p>
                  <p>Stock: {product.stock}</p>
                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </section>

        {cart.length > 0 && (
          <section className="cart">
            <h2>Shopping Cart</h2>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx}>
                  {item.name} - ${parseFloat(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>
              Total: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
            </p>
            <button onClick={placeOrder}>Place Order</button>
          </section>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#666',
        marginTop: '40px',
        borderTop: '1px solid #eee'
      }}>
        <p>🔗 API Connection Status:</p>
        <p style={{ fontSize: '0.9em' }}>
          Product Service: http://localhost:5001 | 
          Order Service: http://localhost:5002
        </p>
      </footer>
    </div>
  );
}

export default App;