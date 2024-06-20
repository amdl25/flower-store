const nodemailer = require('nodemailer');
const MonthlyFlowerSubscription = require('./entities/MonthlyFlowerSubscription');
const Subscriber = require('./entities/Subscriber');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const sendMonthlyFlowerEmail = async () => {
    try {
        const currentMonth = new Date().toLocaleString('ro-RO', { month: 'long' });
        console.log('Luna curentă:', currentMonth);

        const flower = await MonthlyFlowerSubscription.findOne({ month: currentMonth });
        console.log('Floare găsită:', flower);

        if (!flower) {
            console.log('Nu s-a găsit nicio floare pentru această lună.');
            return;
        }

        const subscribers = await Subscriber.find();
        console.log('Abonați găsiți:', subscribers);

        for (const subscriber of subscribers) {
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: subscriber.email,
                subject: `Floarea Lunii: ${flower.flowerName}`,
                html: `
                    <h1>Floarea Lunii - ${flower.month}</h1>
                    <h2>${flower.flowerName}</h2>
                    <img src="${flower.flowerImage}" alt="${flower.flowerName}" style="max-width: 100%; height: auto;" />
                    <p>${flower.description}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email trimis către: ${subscriber.email}`);
        }

        console.log('Email-urile au fost trimise cu succes.');
    } catch (error) {
        console.error('Eroare la trimiterea email-urilor:', error);
    }
};


module.exports = { sendMonthlyFlowerEmail };
