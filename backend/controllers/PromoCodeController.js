const PromoCode = require('../entities/PromoCode');
const mongoose = require('mongoose');

const addPromoCode = async (req, res) => {
    let promocodes = await PromoCode.find({});
    let id;
    if (promocodes.length > 0) {
        let last_promocode_array = promocodes.slice(-1);
        let last_promocode = last_promocode_array[0];
        id = last_promocode.id + 1;
    } else {
        id = 1;
    }
    const { code, discountType, discountValue, expirationDate, usageLimit, criteria} = req.body;
    try {
        const promoCode = new PromoCode({
            id,
            code,
            discountType,
            discountValue,
            expirationDate,
            usageLimit,
            criteria
        });
        await promoCode.save();
        res.json({ success: true, id: promoCode.id,  code: promoCode.code });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const validatePromoCode = async (req, res) => {
    try {
        const { code } = req.body;
        console.log('Validating promo code:', code);

        const promo = await PromoCode.findOne({ code });

        if (!promo) {
            return res.status(404).json({ success: false, error: 'Promo code not found' });
        }

        const isPromoCodeValid = promo.isActive && new Date() < new Date(promo.expirationDate);
        if (!isPromoCodeValid) {
            return res.status(400).json({ success: false, error: 'Promo code is expired or inactive' });
        }

        console.log('Promo Code Details:', {
            'Usage Count': promo.usageCount,
            'Usage Limit': promo.usageLimit,
            'Expiration Date': promo.expirationDate,
            'Is Active': promo.isActive
        });

        if (req.user) {
            const userId = req.user.id;
            console.log('Validating promo code for user:', userId);

            const userUsageCount = promo.usageHistory.get(userId) || 0;

            if (userUsageCount >= promo.usageLimit) {
                return res.status(400).json({ success: false, error: 'Promo code usage limit reached for this user' });
            }
        }

        res.status(200).json({ success: true, promoCode: promo });
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};






const usePromoCode = async (req, res) => {
    const { code } = req.body;
    const user = req.user;

    if (!user) {
        return res.status(400).json({ success: false, error: 'User not authenticated' });
    }

    try {
        const promoCode = await PromoCode.findOne({ code });
        if (!promoCode) {
            return res.status(404).json({ success: false, error: 'Promo code not found' });
        }

        if (promoCode.usageCount >= promoCode.usageLimit) {
            return res.status(400).json({ success: false, error: 'Promo code usage limit reached' });
        }

        const userUsageCount = promoCode.usageHistory.get(user.id) || 0;
        if (userUsageCount >= promoCode.usageLimit) {
            return res.status(400).json({ success: false, error: 'You have reached the usage limit for this promo code' });
        }

        if (new Date() > new Date(promoCode.expirationDate)) {
            return res.status(400).json({ success: false, error: 'Promo code has expired' });
        }

        if (!promoCode.isActive) {
            return res.status(400).json({ success: false, error: 'Promo code is not active' });
        }

        promoCode.usageCount += 1;

        promoCode.usageHistory.set(user.id, userUsageCount + 1);

        await promoCode.save();

        res.json({ success: true, promoCode });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find({});
        res.json(promoCodes);
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const removePromoCode = async (req, res) => {
    await PromoCode.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true, 
        name: req.body.name
    })
}


const updatePromoCode = async (req, res) => {
    const { id, code, discountType, discountValue, expirationDate, usageLimit, usageCount, isActive, criteria} = req.body;

    console.log('Update Promo Code request received:', req.body);

    try {

        const updatedPromoCode = await PromoCode.findOneAndUpdate(
            { id: id },
            {
                code,
                discountType,
                discountValue,
                expirationDate,
                usageLimit,
                usageCount,
                isActive, 
                criteria
            },
            { new: true }
        );

        if (!updatedPromoCode) {
            return res.status(404).json({ success: false, error: 'Promo code not found' });
        }

        res.json({ success: true, promoCode: updatedPromoCode });
    } catch (error) {
        console.error('Error updating promo code:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getPromoCodesByCriteria = async (req, res) => {
    try {
        const { criteria } = req.params;
        const promoCodes = await PromoCode.find({ criteria });
        res.json(promoCodes);
    } catch (error) {
        console.error('Error fetching promo codes by criteria:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserPromoUsage = async (req, res) => {
    const { code, email } = req.body;

    try {
        const promo = await PromoCode.findOne({ code: code });

        if (!promo) {
            return res.status(404).json({ success: false, error: 'Promo code not found' });
        }

        let usageCount = 0;
        if (email) {
            const sanitizedEmail = email.replace(/\./g, '_');
            usageCount = promo.usageHistory.get(sanitizedEmail) || 0;
        }

        res.json({ success: true, usageCount: usageCount });
    } catch (error) {
        console.error('Error fetching promo code usage:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};


module.exports = {
    addPromoCode,
    validatePromoCode,
    usePromoCode,
    getAllPromoCodes,
    removePromoCode,
    updatePromoCode,
    getPromoCodesByCriteria,
    getUserPromoUsage
};
