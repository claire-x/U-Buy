/*
 * ref: https://github.com/bezkoder/nodejs-upload-image-mysql.git
 */
const fs = require("fs");

const db = require("../models");
const Image = db.images;

const uploadFiles = async (req, res) => {
    try {
      let userID = req.cookies.islogin.sid;

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    Image.destroy({
        where: { sid: userID },
    });

    Image.create({
      type: req.file.mimetype,
      sid: userID,
      name: req.file.originalname,
      data: fs.readFileSync(
        __basedir + "/public/uploads/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
          __basedir + "/public/tmp/" + userID +".jpg",
        image.data
        );
        return res.redirect('/account_page') 
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
