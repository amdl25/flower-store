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

    try {
        for (let flower of orderedFlowers) {
            await Flower.updateOne(
                { id: flower.flowerId },
                { $inc: { quantity: -flower.quantity } }
            );
        }
        res.status(200).send('Order processed and quantities updated.');
    } catch (error) {
        console.error('Error decreasing flower quantity:', error);
        res.status(500).send('An error occurred while processing the order.');
    }
}

module.exports = {
    addFlower,
    removeFlower,
    getAllFlowers,
    flowerColors,
    updateFlower,
    decreaseFlowerQuantity
};
