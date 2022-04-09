const fs = require("fs");

const db = require("../models");
const Image = db.images;

const uploadFiles = async (req, res) => {
    try {
        let userID = req.cookies.islogin.sid;
        let postID = req.cookies.postID.id;
        console.log(postID);

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
          __basedir + "/public/tmp/" + postID +".jpg",
        image.data
        );
        return res.redirect('/forum')
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};
