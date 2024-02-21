const Orders = require('../models/ordersModel');
const Products = require('../models/productsModel');
const Artisan = require('../models/artisanModel');
const Customer = require('../models/customerModel')
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();

    if(!orders) res.status(404).json({message: "Error occured while fetching products"})

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    // const userDetails = req.body.customer;
    const cartItems = req.body.items;
    const orderReq = req.body

    let customer = await Customer.findOne({ email: orderReq.customer.email });
    if (!customer) {
      let password = await hashPassword(orderReq.customer.password);
      orderReq.customer.password = password;
      customer = new Customer(orderReq.customer);
      await customer.save();
    }

    const order = {
      order_number: orderReq.order_number,
      customer_id: customer._id,
      // items: [{ product_id: item.product_id, quantity: item.quantity }],
      items: cartItems.map(item => item._id),
      status: 'Pending',
      payment_status: orderReq.payment_status ,
      shipping_fee: orderReq.shipping_fee,
      amount: orderReq.amount
    }

      
    for (const item of cartItems) {
      const artisan = await Artisan.findById(item.artisanId);
      if (artisan && artisan.customers && !artisan.customers.includes(customer._id)) {
        artisan.customers.push(customer._id);
        await artisan.save();

      }
      console.log(cartItems.artisanId)
    }
    

    // const artisan = Artisan.findOne(cartItems.artisanId)
    // artisan.orders.push(order_number)
    // artisan.save()

    

    // const savedOrders = await Promise.all(orders.map(async (order) => {
    //   const savedOrder = new Orders(order);
    //   await savedOrder.save();
    //   await Artisan.findByIdAndUpdate(order.artisan_id, { $push: { orders: savedOrder._id } });
    //   return savedOrder;
    // }));

    const newOder = new Orders(order)
    newOder.save()

    customer.orders.push(newOder);
    await customer.save();

    res.status(200).json({
      customer_id: customer._id,
      orders: customer.orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Order not send. Please try again later...' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    
    // if (!req.session.customer)  return res.status(401).json({ message: 'Customer not logged in' });
    

    const customerId = req.session.customer.id;

  
    const myOrders = await Orders.find({ customer_id: customerId });

    res.status(200).json({ message: 'Orders retrieved successfully', orders: myOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateMyOrders = async (req, res) => {
  try {
    if (!req.session.customer)  return res.status(401).json({ message: 'Customer not logged in' }); 
    
    const orderId = req.params.id;
    // const customerId = req.session.customer.id;

    
  const order = await Orders.findOne({ _id: orderId /*customer_id: customerId */});

    if (!order)  return res.status(404).json({ message: 'Order not found' });
       
    const { status } = req.body;

    if (status)  order.status = status;
    
    await order.save();

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    
    if (!req.session.customer)  return res.status(401).json({ message: 'Customer not logged in' });
    

    const orderId = req.params.id;

  
    const order = await Orders.findOne({ _id: orderId});

    
    if (!order)  return res.status(404).json({ message: 'Order not found' });
    
    await order.remove();
    
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


