const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require('connect-flash');
const csrf = require('csurf');
const multer = require('multer');
const fs = require('fs');

const configServer = (app, localDir) => {
    // Sử dụng body-parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Config cho view engine
    app.engine(
        "handlebars",
        exphbs.create({
            defaultLayout: "main",
            extname: ".handlebars",
            layoutsDir: path.join(localDir, "views/layouts"),
            helpers: {
                toString: function (object) {
                    return encodeURIComponent(JSON.stringify(object));
                }
            }
        }).engine
    );

    // Set view engine
    app.set("view engine", "handlebars");

    // Set path views
    app.set('views', path.join(localDir, '/views'));

    // Set public file
    app.use(express.static(path.join(localDir, 'public')));

    // Config session
    app.use(session({
        secret: 'secret-key',
        resave: false,
        saveUninitialized: true
    }));

    // Use Flash
    app.use(flash());

    // Use csrf
    app.use(cookieParser());
    app.use(csrf({ cookie: true }));

    // Cấu hình lưu trữ file
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const rootFolder = path.join(__dirname, 'upload');
            const folderPath = path.join(rootFolder, req.body.folderName);
            // Kiểm tra xem thư mục có tồn tại hay chưa, nếu chưa thì tạo mới
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }
            // Thư mục để lưu file upload
            cb(null, folderPath);
        },
        filename: function (req, file, cb) {
            // Đặt tên file là tên file gốc
            cb(null,Date.now() + path.extname(file.originalname));
        }
    });

    // Cấu hình kiểm tra file upload
    const upload = multer({
        storage: storage,
        // fileFilter: function (req, file, cb) {
        //     // Chỉ cho phép upload file định dạng .jpeg hoặc .png
        //     const filetypes = /jpeg|jpg|png/;
        //     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        //     const mimetype = filetypes.test(file.mimetype);

        //     if (mimetype && extname) {
        //         return cb(null, true);
        //     } else {
        //         cb('Error: Chỉ cho phép upload file định dạng .jpeg hoặc .png');
        //     }
        // }
    });

    return upload;
}

module.exports = configServer;