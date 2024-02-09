const Orders = require('../models/ordersModel');
const Products = require('../models/productsModel');
const Artisan = require('../models/artisanModel');

exports.placeOrder = async (req, res) => {
  try {
    if (!req.session.customer) {
      return res.status(401).json({ message: 'Customer not logged in' });
    }

    const customerId = req.session.customer.id;

    const orderItems = req.body.items;

    const productsByArtisan = await Promise.all(orderItems.map(async (item) => {
      const product = await Products.findById(item.product_id);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.product_id} not found` });
      }
      return {
        product_id: product._id,
        artisan_id: product.artisanId,
        quantity: item.quantity,
        price: product.price, 
      };
    }));

    // order amount for each artisan
    const orders = {};
    productsByArtisan.forEach((item) => {
      if (!orders[item.artisan_id]) {
        orders[item.artisan_id] = {
          items: [],
          amount: 0,
        };
      }
      orders[item.artisan_id].items.push({ product_id: item.product_id, quantity: item.quantity });
      orders[item.artisan_id].amount += item.quantity * item.price;
    });

    //save
    const savedOrders = await Promise.all(Object.keys(orders).map(async (artisanId) => {
      const order = new Orders({
        order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        customer_id: customerId,
        items: orders[artisanId].items,
        status: 'Pending',
        payment_status: false,
        shipping_fee: req.body.shipping_fee || '0', 
        amount: orders[artisanId].amount.toString(),
      });
      await order.save();

      
      await Artisan.findByIdAndUpdate(artisanId, { $push: { orders: order._id } });

      return order;
    }));

    res.status(200).json({ message: 'Orders placed successfully', orders: savedOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getMyOrders = async (req, res) => {
  try {
    
    if (!req.session.customer) {
      return res.status(401).json({ message: 'Customer not logged in' });
    }

    const customerId = req.session.customer.id;

  
    const myOrders = await Orders.find({ customer_id: customerId });

    res.status(200).json({ message: 'Orders retrieved successfully', orders: myOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
