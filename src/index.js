const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cors = require("cors");
require("./db/connection/connect");
const User = require("./db/model/user");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use("/profilePics", express.static("profilePics"));
var upload = multer({
  // storage: multer.diskStorage({
  //   destination(req, profilepic, cb) {
  //       // console.log(profilepic);
  //     cb(null, "./src/profilePics");
  //     //keep in mind path should be from root directory here from src ,as index is in src folder
  //   },
  //   filename(req, profilepic, cb) {
  //     //   console.log(`${new Date().getTime()}_${profilepic.originalname}`);
  //     cb(null, `${new Date().getTime()}_${profilepic.originalname}`);
  //   },
  // }),/jpeg|jpg|png|gif|svg/
  fileFilter(req, profilepic, cb) {
    if (!profilepic.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
      return cb(new Error("please upload an image"));
    }

    cb(undefined, true);
  },
});

app.post("/upload", upload.single("profilepic"), async (req, res) => {
  // The name attribute of the type="file" in html should match the upload.single('name') in server code.
  try {
    const { firstname, lastname, email, phone, password } = req.body;
    const { path, mimetype } = req.file;
    console.log(req.file);

    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      profilemimetype: mimetype,
      profilepicpath: path,
      phone: phone,
      password: password,
      profilepic: req.file.buffer,
    });
    //profilepic->it is the actual field in mongodb which sores the image

    await user.save();

    res.send("Data Saved......");
  } catch (e) {
    res.send("error ocured during saving data ...");
  }
});

app.get("/userdetail/:email", async (req, res) => {
  //to fetch the user json data
  try {
    const user = await User.findOne({ email: req.params.email });
    console.log("user fetched.. ");
    res.send(user);
  } catch (e) {
    console.log("error occured during fetching user");
    res.send("error occured during fetching user");
  }
});

app.get("/profilepic/:email", async (req, res) => {
  //to fetch the image data
  const user = await User.findOne({ email: req.params.email });
  res.set({ "Content-Type": `${user.profilemimetype}` });
  res.send(user.profilepic);
});

app.listen(port, () => {
  console.log("server is running on port " + port);
});
