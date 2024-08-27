import { sendSms } from '../services/smsService.js';
import Order from '../models/Order.js'; // Ensure this uses ES module syntax

const placeOrder = async (req, res) => {
  const { customerDetails, items, totalPrice } = req.body;

  if (!customerDetails || !items || !totalPrice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order = new Order({
    customerDetails,
    items,
    totalPrice,
    orderDate: new Date()
  });

  try {
    await order.save();

    const orderDetails = items
      .map(item => `${item.name} x ${item.quantity}: Rs ${item.price * item.quantity}`)
      .join('\n');
    const messageBody = `
      Your order has been placed successfully!
      Order Details:
      ${orderDetails}
      Total Price: Rs ${totalPrice}

      Delivery Address:
      ${customerDetails.flatNumber}, ${customerDetails.street}, ${customerDetails.city}, ${customerDetails.state} - ${customerDetails.postalCode}

      Thank you for shopping with us!
    `;

    await sendSms(customerDetails.phone, messageBody);

    res.status(201).json({ message: 'Order placed and SMS sent successfully.' });
  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({ error: 'Error placing order. Please try again later.', details: error.message });
  }
};

export default { placeOrder };
