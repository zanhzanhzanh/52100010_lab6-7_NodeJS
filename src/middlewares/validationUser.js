const { User } = require('../models');
const bcrypt = require('bcrypt');

const validationUser = {
    checkLogin: async (req, res, next) => {
        const users = await User.findAll();

        let flag = true;

        // Compare login
        users.map(val => {
            if(req.body.username === val.email && bcrypt.compareSync(req.body.password, val.password)) {
                // Need field Name
                req.body.name = val.name;

                flag = false;
                next();
            }
        })
        if(flag) {
            req.flash('error', 'Wrong password or Account doesn\'t exist!');
            res.status(400).render('login', {
                csrfToken: req.csrfToken(),
                message: req.flash('error')
            });
        }
    },

    checkRegister: async (req, res, next) => {
        // Check confirm
        if(req.body.password !== req.body.confirmPassword) {
            req.flash('error', 'Confirm Password doesn\'t match!');
            res.status(400).render('register', {
                csrfToken: req.csrfToken(),
                message: req.flash('error')
            });
        }
        else {
            // Check Exist
            const user = await User.findOne({
                where: { email: req.body.email },
            })

            if(user) {
                req.flash('error', 'This account existed!');
                res.status(400).render('register', {
                    csrfToken: req.csrfToken(),
                    message: req.flash('error')
                });
            }
            else {
                // Hash Password
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                next();
            };
        }
    }
}

module.exports = validationUser;