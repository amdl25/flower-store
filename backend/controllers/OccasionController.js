const Product = require('../entities/Product');
const Flower = require('../entities/Flower');
const Occasion = require ('../entities/Occasion');


const addOccasion = async (req, res) => {
    let occasions = await Occasion.find({});
    let id;
    if (occasions.length > 0) {
        let last_occasion_array = occasions.slice(-1);
        let last_occasion = last_occasion_array[0];
        id = last_occasion.id + 1;
    } else {
        id = 1;
    }
    const { name } = req.body;
    try {
        const occasion = new Occasion({ id, name });
        await occasion.save();
        res.json({
            success: true,
            id: occasion.id,
            name: occasion.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

const removeOccasion = async (req, res) => {
    await Occasion.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true, 
        name: req.body.name
    })
}

const getAllOccasions = async (req, res) => {
    let occasions = await Occasion.find({});
    console.log("All Occasions Fetched");
    res.send(occasions);
}


const updateOccasion = async (req, res) => {
    const { id, name } = req.body;

    try {
        const updatedOccasion = await Occasion.findOneAndUpdate(
            { id: id },
            { name },
            { new: true }
        );

        if (!updatedOccasion) {
            return res.status(404).json({ success: false, error: 'Occasion not found' });
        }

        res.json({ success: true, occasion: updatedOccasion });
    } catch (error) {
        console.error('Error updating occasion:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = {
    addOccasion,
    removeOccasion,
    getAllOccasions,
    updateOccasion
};
