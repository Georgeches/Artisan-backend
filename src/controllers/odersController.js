const Orders = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_fee } = req.body;

    const products = await Promise.all(items.map(async item => {
      const product = await Product.findById(item.product_id);
      return {
        product_id: product._id,
        artisanId: product.artisanId,  
        quantity: item.quantity,
        price: product.price
      };
    }));

    const amount = products.reduce((total, product) => total + (product.price * product.quantity), 0);

    const order = new Orders({
      order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      customer_id: req.session.customer.id,
      items: products,
      status: 'Pending',
      payment_status: false,
      shipping_fee: shipping_fee,
      amount: amount.toString(),
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
