const Orders = require('../models/ordersModel');
const Products = require('../models/productsModel');
const Artisan = require('../models/artisanModel');
const Customer = require('../models/customerModel')

exports.placeOrder = async (req, res) => {
  try {
    // const userDetails = req.body.customer;
    const cartItems = req.body.items;
    const orderReq = req.body

 
    // const customerId = req.body.customer_id;

    // const orderAmount = cartItems.reduce((total, item) => total + item.total, 0);

    const customer =  new Customer(orderReq.customer)

    customer.save()
    // .then(
    //   ()=> id = customer._id
    // )
    const customerId = customer._id

    console.log(customerId)



    const order = 
      {
        order_number: req.order_number,
        customer_id: customerId,
        // items: [{ product_id: item.product_id, quantity: item.quantity }],
        items: cartItems.map(item => item._id),
        status: 'Pending',
        payment_status: orderReq.payment_status ,
        shipping_fee: orderReq.shipping_fee,
        amount: orderReq.amount
      }

    cartItems.forEach(item => {
      let artisan = Artisan.findById(item.artisanId)

      if(artisan.customers){
        console.log(artisan.customers)
        if(artisan.customers?.find(customer=>customer._id===customerId) === undefined){
          artisan.customers?.unshift(customerId)
          artisan.save()
        }
      }
    });

    

    // const savedOrders = await Promise.all(orders.map(async (order) => {
    //   const savedOrder = new Orders(order);
    //   await savedOrder.save();
    //   await Artisan.findByIdAndUpdate(order.artisan_id, { $push: { orders: savedOrder._id } });
    //   return savedOrder;
    // }));

    const newOder = new Orders(order)
    newOder.save()


    res.status(200).json({ message: 'Orders placed successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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


