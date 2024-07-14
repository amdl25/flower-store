const User = require('../entities/User');

const addToCart = async (req, res) => {
    try {
        const { productId, date, time, greetingMessage, selectedOptions } = req.body;

        if (req.user) {
            console.log("Authenticated user:", req.user);
            let user = await User.findOne({ _id: req.user.id });
            if (!user) {
                console.log("User not found");
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (!user.cartData) {
                user.cartData = {};
            }

            let productInCart = user.cartData[productId];

            if (productInCart) {
                console.log("Product already in cart, updating quantity and details");
                productInCart.quantity += 1;
                productInCart.date = date;
                productInCart.time = time;
                productInCart.greetingMessage = greetingMessage;
                productInCart.selectedOptions = selectedOptions;
            } else {
                console.log("Product not in cart, adding new item");
                user.cartData[productId] = {
                    quantity: 1,
                    date,
                    time,
                    greetingMessage,
                    selectedOptions
                };
            }

            console.log("Updated cartData:", user.cartData);

            await user.save();

            res.json({ success: true, message: "Added to cart", cartData: user.cartData });
        } else {
            console.log("Unauthenticated user, handling on the client side");
            res.json({ success: true, message: "Product should be added to the client-side cart for unauthenticated users" });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const removeFromCart = async (req, res) => {
    try {
        console.log("Removing product from cart", req.body.itemId);
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getCartData = async (req, res) => {
    try {
        console.log("Fetching cart data");
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error("Error fetching cart data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCartData
};
