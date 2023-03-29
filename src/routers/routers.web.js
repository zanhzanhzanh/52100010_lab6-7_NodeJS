const userControllers = require('../controllers/user.controllers');
const validationUser = require('../middlewares/validationUser');
const express = require('express');
const router = express.Router();

const routers = (app, upload) => {
    router.get('/', (req, res) => { res.status(200).render("login", {
            csrfToken: req.csrfToken()
        });
    });

    router.get('/register', (req, res) => { res.status(200).render("register", {
            csrfToken: req.csrfToken()
        });
    });

    router.post('/login', validationUser.checkLogin, (req, res) => { res.status(200).render("index", {
            csrfToken: req.csrfToken(),
            name: req.body.name
        });
    });

    router.post('/register', validationUser.checkRegister, userControllers.createUser);

    router.post('/upload', upload.any(), (req, res) => {
        console.log(req);
        res.send(req.files);
    })

    return app.use('/', router);
}

module.exports = routers;