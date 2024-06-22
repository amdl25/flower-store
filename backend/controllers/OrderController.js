const Order = require('../entities/Order');
const User = require('../entities/User');
const Product = require('../entities/Product');
const Flower = require('../entities/Flower');
const PromoCode = require('../entities/PromoCode');


const addOrder = async (req, res) => {
    try {
        console.log('Received order data:', req.body);

        const userId = req.user ? req.user.id : null;
        const userEmail = req.body.email;

        console.log('User ID:', userId);
        console.log('User Email:', userEmail);

        if (!userId) {
            console.warn('User ID is null. Only authenticated users should be able to use promo codes.');
        }

        let orders = await Order.find({});
        let id;

        if (orders.length > 0) {
            let last_order = orders[orders.length - 1];
            id = last_order.id + 1;
        } else {
            id = 1;
        }

        const { name, address, email, phone, deliveryMethod, paymentMethod, products, totalAmount, promoCode } = req.body;

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
                for (let productFlower of productInDb.flowers) {
                    const flowerInDb = await Flower.findOne({ id: productFlower.flower });
                    if (flowerInDb) {
                        flowerInDb.quantity -= productFlower.quantity * product.quantity;
                        await flowerInDb.save();
                    }
                }
            }
        }

        if (promoCode) {
            const promo = await PromoCode.findOne({ code: promoCode });

            if (promo) {
                let identifier = userId ? userId.toString() : userEmail;

                if (!userId) {
                    identifier = identifier.replace(/\./g, '_');
                }

                const userUsageCount = promo.usageHistory.get(identifier) || 0;

                console.log(`User/Email ${identifier} current usage count for promo code ${promoCode}: ${userUsageCount}`);
                console.log(`Promo code ${promoCode} current general usage count: ${promo.usageCount}`);

                if (userUsageCount < promo.usageLimit) {
                    promo.usageCount += 1;
                    promo.usageHistory.set(identifier, userUsageCount + 1);
                    await promo.save();

                    console.log(`Updated usage count for promo code ${promoCode}: ${promo.usageCount}`);
                    console.log(`Updated usage history for user/email ${identifier} on promo code ${promoCode}: ${promo.usageHistory.get(identifier)}`);
                } else {
                    console.warn(`User/Email ${identifier} has reached the usage limit for promo code ${promoCode}`);
                    return res.status(400).json({ success: false, error: `Promo code ${promoCode} usage limit reached.` });
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

const getUserOrderCount = async (req, res) => {
    try {
        const { email } = req.params;
        const orderCount = await Order.countDocuments({ email: email });
        
        if (orderCount >= 0) {
            res.json({ success: true, orderCount });
        } else {
            res.status(404).json({ success: false, message: 'No orders found for the given user.' });
        }
    } catch (error) {
        console.error('Error fetching order count:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    addOrder,
    getUserOrders,
    getUserOrderCount
};