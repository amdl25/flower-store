const MonthlyFlowerSubscription = require('../entities/MonthlyFlowerSubscription');

const addMonthlyFlower = async (req, res) => {
    let monthlyFlowers = await MonthlyFlowerSubscription.find({});
    let id;
    if (monthlyFlowers.length > 0) {
        let last_monthlyFlower = monthlyFlowers[monthlyFlowers.length - 1];
        id = last_monthlyFlower.id + 1;
    } else {
        id = 1;
    }
    
    const { month, flowerName, description } = req.body;
    const flowerImage = req.file ? req.file.path : req.body.flowerImage;

    if (!month || !flowerName || !description || !flowerImage) {
        return res.status(400).json({ success: false, message: 'All fields are required, including the image' });
    }

    const monthlyFlower = new MonthlyFlowerSubscription({
        id,
        month,
        flowerName,
        flowerImage,
        description
    });

    try {
        await monthlyFlower.save();
        res.json({
            success: true,
            message: 'Monthly flower added successfully',
            monthlyFlower
        });
    } catch (error) {
        console.error('Error adding monthly flower:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};




const getAllMonthlyFlowers = async (req, res) => {
    try {
        const flowers = await MonthlyFlowerSubscription.find();
        res.status(200).json({ success: true, flowers });
    } catch (error) {
        console.error('Error fetching monthly flowers:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


const updateMonthlyFlower = async (req, res) => {
    const { id, month, flowerName, description, flowerImage } = req.body;
    
    try {
        await MonthlyFlowerSubscription.findOneAndUpdate(
            { id: id },
            { month, flowerName, description, flowerImage }
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating monthly flower subscription:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const removeMonthlyFlower = async (req, res) => {
        await MonthlyFlowerSubscription.findOneAndDelete({ id: req.body.id });
        console.log("Monthly Flower Subscription Removed");
        res.json({
            success: true,
            name: req.body.flowerName
        });
};


module.exports = {
    addMonthlyFlower,
    getAllMonthlyFlowers,
    updateMonthlyFlower,
    removeMonthlyFlower

}