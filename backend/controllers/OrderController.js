const Order = require('../entities/Order');
const User = require('../entities/User');
const Product = require('../entities/Product');
const Flower = require('../entities/Flower');


const addOrder = async (req, res) => {
    try {
        console.log('Received order data:', req.body);

        let orders = await Order.find({});
        let id;

        if (orders.length > 0) {
            let last_order = orders[orders.length - 1];
            id = last_order.id + 1;
        } else {
            id = 1;
        }

        const { name, address, email, phone, deliveryMethod, paymentMethod, products, totalAmount } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid products array' });
        }

        for (let product of products) {
            if (!product.productId || !product.quantity) {
                return res.status(400).json({ success: false, error: 'Invalid product entry' });
            }
        }

        const orderFields = {
            id,
            name,
            email,
            phone,
            deliveryMethod,
            paymentMethod,
            products,
            totalAmount
        };

        if (deliveryMethod === 'livrare') {
            orderFields.address = address;
        }

        const newOrder = new Order(orderFields);
        await newOrder.save();

        for (let product of products) {
            const productInDb = await Product.findOne({ id: product.productId });
            if (productInDb) {
                productInDb.productQuantity -= product.quantity;
                await productInDb.save();

                for (let productFlower of productInDb.flowers) {
                    const flowerInDb = await Flower.findOne({ id: productFlower.flower });
                    if (flowerInDb) {
                        flowerInDb.quantity -= productFlower.quantity * product.quantity;
                        await flowerInDb.save();
                    }
                }
            }
        }

        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const orders = await Order.find({ email: user.email });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    addOrder,
    getUserOrders
};