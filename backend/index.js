const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cron = require('node-cron');

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI)


app.use('/images', express.static('upload/images'));

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });


app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

app.post("/upload/monthlyflower", upload.single('flowerImage'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});


cron.schedule('0 0 1 * *', async () => {
    console.log('Trimiterea email-urilor pentru floarea lunii...');
    await sendMonthlyFlowerEmail();
});



const cartRoutes = require('./routes/CartRoutes');
const flowerRoutes = require('./routes/FlowerRoutes');
const occasionRoutes = require('./routes/OccasionRoutes');
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');
const promoCodeRoutes = require('./routes/PromoCodeRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const monthlyFlowerSubscriptionRoutes = require('./routes/MonthlyFlowerSubscriptionRoutes');
const subscriberRoutes = require('./routes/SubscriberRoutes');

app.use('/api/cart', cartRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/occasions', occasionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/promocodes', promoCodeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/monthlyflowersubscriptions', monthlyFlowerSubscriptionRoutes);
app.use('/api/subscribers', subscriberRoutes);

app.get("/", (req, res) => {
    res.send("Express App is Running");
});

app.listen(port, (error) => {
    if (!error) {
        console.log(`Server running on port ${port}`);
    } else {
        console.log("Error: ", error);
    }
});
