const Product = require('../entities/Product');
const Flower = require('../entities/Flower');
const Occasion = require ('../entities/Occasion');

const addProduct = async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const { name, image, category, price, discountedPrice, productQuantity, flowers, occasions, isSurprise } = req.body;

    const productFields = {
        id,
        name,
        image,
        category,
        price,
        productQuantity
    };

    if (discountedPrice) {
        productFields.discountedPrice = discountedPrice;
    }

    if (flowers) {
        const flowerIds = flowers.map(f => f.flower);
        const dbFlowers = await Flower.find({ id: { $in: flowerIds } });

        for (let f of flowers) {
            const dbFlower = dbFlowers.find(dbF => dbF.id === f.flower);
            if (!dbFlower) {
                console.error(`Flower with id ${f.flower} not found`);
                return res.status(400).json({ success: false, error: `Flower with id ${f.flower} not found` });
            }
            if (f.quantity > dbFlower.quantity) {
                console.error(`Provided quantity for flower id ${f.flower} exceeds available stock`);
                return res.status(400).json({ success: false, error: `Provided quantity for flower id ${f.flower} exceeds available stock` });
            }
        }

        productFields.flowers = flowers.map(f => ({
            flower: f.flower,
            quantity: f.quantity
        }));
    }

    if (occasions) {
        productFields.occasions = occasions.map(occasion => occasion);
    }

    if (isSurprise !== undefined) {
        productFields.isSurprise = isSurprise;
    }

    try {
        const product = new Product(productFields);
        await product.save();
        res.json({
            success: true,
            name: productFields.name
        });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const getAllProducts = async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
};

const updateProduct = async (req, res) => {
    const { id, name, price, discountedPrice, category, productQuantity, image } = req.body;

    try {
        await Product.findOneAndUpdate(
            { id: id },
            { name, price, discountedPrice, category, productQuantity, image }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const removeProduct = async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
};

const newCollection = async (req, res) => {
    try {
        let newcollection = await Product.find({}).sort({ _id: -1 }).limit(3);
        
        console.log('New collection fetched:', newcollection);
        
        res.status(200).json(newcollection);
    } catch (error) {
        console.error("Error fetching new collection:", error);
        res.status(500).send({ error: 'Failed to fetch new collection' });
    }
};

const productsDiscounted = async (req, res) => {
    try {
        const discountedProducts = await Product.find({ discountedPrice: { $exists: true, $ne: null } });
        res.json(discountedProducts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
}

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findOne({ id: parseInt(productId, 10) });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Produsul nu a fost găsit.' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error('Eroare la obținerea produsului:', error);
        res.status(500).json({ success: false, error: 'A apărut o eroare la obținerea produsului.' });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    updateProduct,
    removeProduct,
    newCollection, 
    productsDiscounted,
    getProductById
};