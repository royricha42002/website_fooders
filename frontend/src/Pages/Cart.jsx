import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './Cart.css'; // Import the CSS file for styling

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    flatNumber: '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (index, quantity) => {
    const updatedCart = [...cart];
    if (quantity > 0) {
      updatedCart[index].quantity = quantity;
    } else {
      updatedCart.splice(index, 1); // Remove item if quantity is 0
    }
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    // Name validation: should not be empty and at least 2 characters long
    if (!customerDetails.name || customerDetails.name.length < 2) {
      newErrors.name = 'Name is required and should be at least 2 characters long';
      valid = false;
    }

    // Phone validation: should not be empty and should match a phone number pattern
    const phonePattern = /^[0-9]{10}$/;
    if (!customerDetails.phone || !phonePattern.test(customerDetails.phone)) {
      newErrors.phone = 'Phone number is required and should be 10 digits long';
      valid = false;
    }

    // Flat number and street validation: should not be empty
    if (!customerDetails.flatNumber || !customerDetails.street) {
      newErrors.address = 'Flat number and street are required';
      valid = false;
    }

    // City validation: should not be empty
    if (!customerDetails.city) {
      newErrors.city = 'City is required';
      valid = false;
    }

    // State validation: should not be empty
    if (!customerDetails.state) {
      newErrors.state = 'State is required';
      valid = false;
    }

    // Postal code validation: should not be empty and should match a postal code pattern
    const postalCodePattern = /^[0-9]{6}$/;
    if (!customerDetails.postalCode || !postalCodePattern.test(customerDetails.postalCode)) {
      newErrors.postalCode = 'Postal code is required and should be 6 digits long';
      valid = false;
    }

    // Show error messages
    Object.values(newErrors).forEach(error => toast.error(error));
    return valid;
  };

  const handleCheckout = () => {
    if (validateForm()) {
      localStorage.setItem('customerDetails', JSON.stringify(customerDetails));
      navigate('/checkout');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  return (
    <div className="cart">
      <Toaster position="top-center" reverseOrder={false} />
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty!</p>
      ) : (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div className="cart-item" key={index}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.name}</h2>
                <p className="cart-item-price">Rs {item.price.toFixed(2)}</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(index, parseInt(e.target.value, 10) || 0)}
                    min="0"
                  />
                  <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h2>Total: Rs {getTotalPrice()}</h2>
            <div className="customer-details">
              <h3>Customer Details</h3>
              <input
                type="text"
                name="name"
                value={customerDetails.name}
                onChange={handleChange}
                placeholder="Name"
                className="customer-input"
              />
              <input
                type="tel"
                name="phone"
                value={customerDetails.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="customer-input"
              />
              <input
                type="text"
                name="flatNumber"
                value={customerDetails.flatNumber}
                onChange={handleChange}
                placeholder="Flat Number"
                className="customer-input"
              />
              <input
                type="text"
                name="street"
                value={customerDetails.street}
                onChange={handleChange}
                placeholder="Street"
                className="customer-input"
              />
              <input
                type="text"
                name="city"
                value={customerDetails.city}
                onChange={handleChange}
                placeholder="City"
                className="customer-input"
              />
              <input
                type="text"
                name="state"
                value={customerDetails.state}
                onChange={handleChange}
                placeholder="State"
                className="customer-input"
              />
              <input
                type="text"
                name="postalCode"
                value={customerDetails.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="customer-input"
              />
            </div>
            <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
