const Product = require('../entities/Product');
const Flower = require('../entities/Flower');
const Occasion = require ('../entities/Occasion');


const addFlower = async (req, res) => {
    let flowers = await Flower.find({});
    let id;
    if (flowers.length > 0) {
        let last_flower_array = flowers.slice(-1);
        let last_flower = last_flower_array[0];
        id = last_flower.id + 1;
    } else {
        id = 1;
    }
    const { name, colors, quantity } = req.body;
    try {
        const flower = new Flower({ id, name, colors, quantity});
        await flower.save();
        res.json({
            success: true,
            id: flower.id,
            name: flower.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const removeFlower = async (req, res) => {
    await Flower.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true, 
        name: req.body.name
    })
}

const getAllFlowers = async (req, res) => {
    let flowers = await Flower.find({});
    console.log("All Flowers Fetched");
    res.send(flowers);
}

const flowerColors = async (req, res) => {
    const flowerId = parseInt(req.params.flowerId);
    try {
        const flower = await Flower.findOne({ id: flowerId });
        if (!flower) {
            return res.status(404).json({ message: 'Flower not found' });
        }
        const colors = flower.colors.map(color => ({ value: color, label: color }));
        res.json(colors);
    } catch (error) {
        console.error('Error fetching flower colors:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateFlower = async (req, res) => {
    const { id, name, colors, quantity } = req.body;

    try {
        const updatedFlower = await Flower.findOneAndUpdate(
            { id: id },
            { name, colors, quantity },
            { new: true }
        );

        if (!updatedFlower) {
            return res.status(404).json({ success: false, error: 'Flower not found' });
        }

        res.json({ success: true, flower: updatedFlower });
    } catch (error) {
        console.error('Error updating flower:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const decreaseFlowerQuantity = async (req, res) => {
    const { orderedFlowers } = req.body;

    console.log('Received request to decrease quantity:', req.body);

    if (!Array.isArray(orderedFlowers) || orderedFlowers.length === 0) {
        return res.status(400).json({ error: 'Invalid input data. orderedFlowers should be a non-empty array.' });
    }

    try {
        for (let flower of orderedFlowers) {
            if (!flower.flowerId || typeof flower.quantity !== 'number' || flower.quantity <= 0) {
                console.error('Invalid flower data:', flower);
                return res.status(400).json({ error: 'Invalid flower data. Each flower must have a valid flowerId and a positive quantity.' });
            }

            const foundFlower = await Flower.findOne({ id: flower.flowerId });
            if (!foundFlower) {
                console.error(`Flower with ID ${flower.flowerId} not found.`);
                return res.status(404).json({ error: `Flower with ID ${flower.flowerId} not found.` });
            }

            const newQuantity = foundFlower.quantity - flower.quantity;
            if (isNaN(newQuantity) || newQuantity < 0) {
                console.error(`Invalid resulting quantity for flower ID ${flower.flowerId}:`, newQuantity);
                return res.status(400).json({ error: `Invalid resulting quantity for flower ID ${flower.flowerId}.` });
            }

            await Flower.updateOne(
                { id: flower.flowerId },
                { $set: { quantity: newQuantity } }
            );

            console.log(`Updated flower ID ${flower.flowerId}: Decremented by ${flower.quantity}, New quantity ${newQuantity}`);
        }
        res.status(200).json({ message: 'Order processed and quantities updated.' });
    } catch (error) {
        console.error('Error decreasing flower quantity:', error);
        res.status(500).json({ error: 'An error occurred while processing the order.' });
    }
};




module.exports = {
    addFlower,
    removeFlower,
    getAllFlowers,
    flowerColors,
    updateFlower,
    decreaseFlowerQuantity
};
