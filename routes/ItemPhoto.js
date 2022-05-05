/**
 * Module to handle item photo upload
 * ref: https://github.com/bezkoder/nodejs-upload-image-mysql.git
 */

const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_post");
const uploadController = require("../controllers/uploadItemImg");
const upload = require("../middleware/upload");


let routes = (app) => {
    router.get("/", homeController.getHome);

    router.post("/upload", upload.single("file"), uploadController.uploadFiles);

    return app.use("/photoItem", router);
};

module.exports = routes;
