const Subscriber = require('../entities/Subscriber');

const addSubscriber = async (req, res) => {
    const { email } = req.body;

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
        return res.status(400).json({ success: false, message: 'Email-ul este deja abonat.' });
    }

    const newSubscriber = new Subscriber({ email });

    try {
        await newSubscriber.save();
        res.json({ success: true, message: 'Te-ai abonat cu succes!', subscriber: newSubscriber });
    } catch (error) {
        console.error('Error adding subscriber:', error);
        res.status(500).json({ success: false, message: 'A apărut o eroare. Te rugăm să încerci din nou.' });
    }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find();
        res.json({ success: true, subscribers });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ success: false, message: 'A apărut o eroare la preluarea abonaților.' });
    }
};

module.exports = {
    addSubscriber,
    getSubscribers
};
