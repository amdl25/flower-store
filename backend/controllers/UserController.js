const User = require('../entities/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Există deja un utilizator cu această adresă de email" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        cartData: cart
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({ success: true, token });
};

const loginUser = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };

            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({
                success: true,
                token,
                user: {
                    email: user.email,
                    name: user.name,
                    address: user.address
                }
            });
        } else {
            res.json({ success: false, errors: "Parolă greșită" });
        }
    } else {
        res.json({ success: false, errors: "Email greșit" });
    }
};

const getUserProfile = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilizatorul nu a fost găsit' });
        }

        const estimatedPasswordLength = 8;

        res.json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                address: user.address,
                passwordLength: estimatedPasswordLength,
                date: user.date
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Invalid token' });
    }
};


const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'Utilizatorul nu a fost găsit' });
        }

        res.json({ success: true, message: 'Utilizator șters cu succes' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Eroare la ștergerea utilizatorului' });
    }
};

const updateUserProfile = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        const updateData = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address
        };

        if (req.body.password && req.body.password.length > 0) {
            const bcrypt = require('bcrypt');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, error: 'Utilizatorul nu a fost găsit' });
        }

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Eroare la modificarea profilului utilizatorului' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    deleteUserProfile,
    updateUserProfile
};
