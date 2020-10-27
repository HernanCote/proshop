const asyncHandler = require('express-async-handler');
const Order = require('../../models/order');

// @desc    Create new order
// @route   POST api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Order Items should contain at least one item');
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

// @desc    Get order by id
// @route   POST api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order =
    await Order.findById(req.params.id)
      .populate('user', 'name email');

  if (order) {
    return res.status(200).json(order);
  }
  res.status(404);
  throw new Error('Order not found');
});

// @desc    Update order to "paid"
// @route   POST api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log('-------body-------');
  console.log(req.body);
  const order = await Order.findById(req.params.id);
  console.log('-------order-------');
  console.log(order);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  }
  res.status(404);
  throw new Error('Order not found');
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
};