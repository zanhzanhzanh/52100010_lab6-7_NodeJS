const { User } = require('../models');

const userControllers = {
    createUser: async (req, res) => {
        const { name, password, email } = req.body;
        try {
            const newUser = await User.create({ name, password, email });
            req.flash('success', 'Success create account!')
            res.status(200).render('register', {
                success: req.flash('success')
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = userControllers;