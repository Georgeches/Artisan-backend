const Customer = require('../models/customerModel');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const findCustomer = Customer.findOne(orderReq.email)
    if(findCustomer) {
      return res.json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const customer = new Customer({ name, email, password: hashedPassword });
    await customer.save();

   
    req.session.customer = { id: customer._id, email: customer.email };

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


